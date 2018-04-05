# Image Retrieval using YOLO

## DATASET
The dataset can be obtained from [here](http://cocodataset.org/)

## Note
Compile and run `yolo.d/train.c`. You must have installed Mongo C Driver.

### Install Mongo C Driver
Download [here](http://mongoc.org/) and cd the dir

```bash
./configure
make
sudo make install
```

Make sure your mongo daemon is running in the background
`mongod --dbpath ~/data/db` (data/db exists already)

## Useful Links
* [YOLO: Real-Time Object Detection](https://pjreddie.com/darknet/yolo/)
* [COCO Dataset](http://cocodataset.org/#home)
*

## Results

<div align="center">
  <img src="https://www.dropbox.com/s/gvgt02besx9ix9i/img_yolo2.jpg?raw=1"><br /><br />
  <img src="https://www.dropbox.com/s/0w8vjp3de6zrwp7/img_yolo1.png?raw=1"><br /><br />
</div>


## License

MIT License (MIT)

