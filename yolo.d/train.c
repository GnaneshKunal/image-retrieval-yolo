#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <dirent.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdbool.h>
#include <omp.h>
#include <mongoc.h>
#include <bcon.h>

#define MAX_LINE 4096

void err_quit(const char *);
void do_json(char *, char *, char*, char*);

int main(void) {
  DIR *dp;
  struct dirent *dirp;
  char *darknet = "/home/monster/git/darknet/";

  if (chdir(darknet) == -1)
    err_quit("can't change directory");

  if ((dp = opendir("./dataset")) == NULL)
    err_quit("can't open dir");

  while ((dirp = readdir(dp)) != NULL) {
    char *fileName = dirp->d_name;
    if ((strcmp(fileName, "..") == 0) || strcmp(fileName, ".") == 0)
      continue;
    FILE *fp;
    char path[100000];

    char predictions[100];
    strcpy(predictions, darknet);
    strcat(predictions, "/predictions.png");

    char newPredictions[100];
    strcpy(newPredictions, darknet);
    strcat(newPredictions, "dest/");
    strncat(newPredictions, dirp->d_name, strchr(dirp->d_name, '.') - dirp->d_name);
    strcat(newPredictions, ".png");

    char name[100];
    strcpy(name, darknet);
    strcat(name, "dataset/");
    strcat(name, dirp->d_name);

    char doneName[100];
    strcpy(doneName, darknet);
    strcat(doneName, "done_dataset/");
    strcat(doneName, dirp->d_name);

    char cmd[1024];
    strcpy(cmd, "./darknet detect cfg/yolo.cfg yolo.weights ");
    strcat(cmd, name);
    puts(name);

    fp = popen(cmd, "r");
    if (fp == NULL) {
      puts("Failed to run the command");
      exit(1);
    }
    char *data = (char *)malloc(1000 * sizeof(char));
    strcpy(data, "");
    int dataFlag = false;
    while (fgets(path, sizeof(path) - 1, fp) != NULL) {
      rename(name, doneName);
      rename(predictions, newPredictions);
      strcat(data, path);
    }
    puts("DATA contains: ");
    puts(data);
    char *json = malloc(1000);
    char dirname[100];
    strcpy(dirname, darknet);
    strcat(dirname, dirp->d_name);
    char dirnamep[100];
    strcpy(dirnamep, newPredictions);

    do_json(json, data, dirname, newPredictions);

    mongoc_client_t * client;
    mongoc_collection_t * collection;
    bson_error_t error;
    bson_oid_t oid;
    bson_t *doc;

    mongoc_init();

    client = mongoc_client_new("mongodb://localhost:27017/?appname=cbir-yolo");
    collection = mongoc_client_get_collection(client, "cbir", "yolos");

    bson_t *bson;
    char *string;
    bson = bson_new_from_json((const uint8_t *)json, -1, &error);

    if (!bson) {
      fprintf(stderr, "%s\n", error.message);
      return EXIT_FAILURE;
    }

    string = bson_as_canonical_extended_json(bson, NULL);
    printf("%s\n", string);

    if (!mongoc_collection_insert_one(
                                      collection, bson, NULL, NULL, &error)) {
      fprintf(stderr, "%s\n", error.message);
    }

    bson_free(string);
    mongoc_collection_destroy(collection);
    mongoc_client_destroy(client);
    mongoc_cleanup();

    free(data);
    free(json);
    pclose(fp);

  }
  closedir(dp);
  exit(0);
}

void err_quit(const char *fmt) {
  puts(fmt);
  exit(1);
}

void do_json(char *json, char *data, char *dir, char *dirp) {
  char *fn = strchr(data, '\n');
  strcpy(json, "{");
  strcat(json, "\"dir\": \"");
  strcat(json, dir);
  strcat(json, "\", \"dirp\":\"");
  strcat(json, dirp);
  strcat(json, "\", \"predicted\": [");
  char *labels = malloc(1000 * sizeof(char));
  strcpy(labels, "\"labels\": [");
  while ((fn = strchr(fn, '\n') + 1) != NULL && strlen(fn) != 0) {
    char *end2 = strchr(fn, ':');
    int k2 = end2 - fn;
    char *buf2 = (char *)malloc(k2 * sizeof(char));
    strncpy(buf2, fn, k2);
    buf2[k2] = '\0';
    strcat(json, "{\"");
    strcat(json, buf2);
    strcat(json, "\": \"");

    strcat(labels, "\"");
    strcat(labels, buf2);
    strcat(labels, "\",");

    char * start3 = strchr(fn, ':') + 2;
    char * end3 = strchr(fn, '\n');
    int k3 = end3 - start3;
    char *buf3 = (char *)malloc(k3 * sizeof(char));
    strncpy(buf3, start3, k3);
    buf3[k3] = '\0';
    strcat(json, buf3);
    strcat(json, "\"}");

    strcat(json, ",");
  }

  labels[strlen(labels) - 1] = ']';
  labels[strlen(labels)] = '\0';
  json[strlen(json) - 1] = ' ';
  strcat(json, "]");
  strcat(json, ",");
  strcat(json, labels);
  strcat(json, "}");
  free(labels);
}

