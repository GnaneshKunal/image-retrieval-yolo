#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <dirent.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdbool.h>
#include <omp.h>

#define MAX_LINE 4096

void err_quit(const char *);

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
      rename(predictions, newPredictions);
      strcat(data, path);
    }
    puts("DATA contains: ");
    puts(data);
    free(data);
    pclose(fp);

  }
  closedir(dp);
  exit(0);
}

void err_quit(const char *fmt) {
  puts(fmt);
  exit(1);
}

