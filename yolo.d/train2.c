#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <dirent.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdbool.h>
#include <mongoc.h>
#include <bcon.h>

#define MAX_LINE 4096

void err_quit(const char *);

int main(void) {
char *data =
  "/home/monster/git/darknet/dataset/tc2.jpg: Predicted in 12.776491 seconds.\n\
traffic light: 47%\n\
traffic light: 58%\n\
traffic light: 75%\n\
traffic light: 68%\n\
traffic light: 45%\n\
traffic light: 65%\n\
car: 54%\n\
car: 31%\n\
bench: 36%\n\
truck: 68%\n\
truck: 80%\n\
car: 72%\n\
truck: 33%\n\
car: 75%\n"
;

 char *fn = strchr(data, '\n');
 while ((fn = strchr(fn, '\n') + 1) != NULL && strlen(fn) != 0) {
   //puts(fn);
   char * end = strchr(fn, '\n');
   int k = end - fn;
   char *buf = (char *)malloc(k * sizeof(char));
   strncpy(buf, fn, k);
   buf[k] = '\0';
   printf("data: %s \n", buf);
   free(buf);
 }

 /*
 const char *uri_str = "mongodb://localhost:27017";
 mongoc_client_t *client;
 mongoc_database_t *database;
 mongoc_collection_t *collection;
 bson_t *command, reply, *insert;
 bson_error_t error;
 char *str;
 bool retval;

 mongoc_init();

 client = mongoc_client_new(uri_str);

 mongoc_client_set_appname(client, "connect-example");

 database = mongoc_client_get_database(client, "inventory");

 collection = mongoc_client_get_collection(client, "inventory", "inventory");

 command = BCON_NEW("ping", BCON_INT32(1));

 retval = mongoc_client_command_simple(
                                       client, "admin", command, NULL, &reply, &error);

 if (!retval) {
   fprintf(stderr, "%s\n", error.message);
   return EXIT_FAILURE;
 }

 str = bson_as_json(&reply, NULL);
 printf("%s\n", str);

 insert = BCON_NEW("hello", BCON_UTF8("world"));

 if (!mongoc_collection_insert_one(collection, insert, NULL, NULL, &error)) {
   fprintf(stderr, "%s\n", error.message);
 }

 bson_destroy(insert);
 bson_destroy(&reply);
 bson_destroy(command);
 bson_free(str);


 mongoc_collection_destroy(collection);
 mongoc_database_destroy(database);
 mongoc_client_destroy(client);
 mongoc_cleanup();

*/

 mongoc_client_t * client;
 mongoc_collection_t * collection;
 bson_error_t error;
 bson_oid_t oid;
 bson_t *doc;

 mongoc_init();

 client = mongoc_client_new("mongodb://localhost:27017/?appname=insert-example");
 collection = mongoc_client_get_collection(client, "inventory", "mycoll");

 doc = bson_new();
 bson_oid_init(&oid, NULL);
 BSON_APPEND_OID(doc, "_id", &oid);
 BSON_APPEND_UTF8(doc, "hello", "world");

 if (!mongoc_collection_insert_one(
                                   collection, doc, NULL, NULL, &error)) {
   fprintf(stderr, "%s\n", error.message);
 }

 bson_destroy(doc);
 mongoc_collection_destroy(collection);
 mongoc_client_destroy(client);
 mongoc_cleanup();

  exit(0);
}


void err_quit(const char *fmt) {
  puts(fmt);
  exit(1);
}

void print_some(char * str, size_t len) {
  for (int i = 0; i < len; i++) {
    putchar(str[i]);
  }
}
