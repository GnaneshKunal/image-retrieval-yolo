const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');
const process = require('process');
const path = require('path');

var files = fs.readdirSync("/home/monster/git/darknet/dataset");

async function classifyImage(img) {
    let t = spawn("./darknet", ["detect", "cfg/yolo.cfg", "yolo.weights", "dataset/" + img]);
    var cnnData = "";
    t.stdout.on('data', (data) => {
        cnnData += data;
    });

    await t.on('close', (code) => {
        fs.copyFileSync('/home/monster/git/darknet/predictions.png', '/home/monster/git/darknet/dest/trained_' + path.basename(img, '.jpg') + '.png');
        var fin = cnnData.slice(cnnData.search(/!/) + 1).split('\n')
        console.log(`stdout: ${fin}`);
    });

}

function test() {
    process.chdir('/home/monster/git/darknet');
    files.map(file => {
        classifyImage(file);
    });
}

test();

/*
for (var i = 0; i < files.length; i++) {
    process.chdir('/home/monster/git/darknet');

    console.log(classifyImage(files[i]));
};
*/
/*
fs.readdir("/home/monster/git/darknet/dataset", (err, files) => {
    if (err)
        console.log(err);
    else {
        for (var i = 0; i < files.length; i++) {
            process.chdir('/home/monster/git/darknet');
            let t = spawn("./darknet", ["detect", "cfg/yolo.cfg", "yolo.weights", "dataset/" + files[i]]);
            var cnnData = "";
            t.stdout.on('data', (data) => {
                cnnData += data;
            });

            //t.stderr.on('data', (data) => {
            //    console.log(`stdout: ${data}`);
            //});

            t.on('close', (code) => {
                fs.copyFileSync('/home/monster/git/darknet/predictions.png', '/home/monster/git/darknet/dest/trained_' + files[i]);
                var fin = cnnData.slice(cnnData.search(/!/) + 1).split('\n')
                console.log(`stdout: ${fin}`);
            });
        };

        _.forEach(files, (file) => {
            process.chdir('/home/monster/git/darknet');
            let t = spawn("./darknet", ["detect", "cfg/yolo.cfg", "yolo.weights", "dataset/" + file]);
            var cnnData = "";
            t.stdout.on('data', (data) => {
                cnnData += data;
            });

            //t.stderr.on('data', (data) => {
            //    console.log(`stdout: ${data}`);
            //});

            t.on('close', (code) => {
                var fin = cnnData.slice(cnnData.search(/!/) + 1).split('\n')
                console.log(`stdout: ${fin}`);
            });
        });

    }
        //console.log(files);
});
*/
