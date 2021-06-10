var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});

var txt_listener = new ROSLIB.Topic({
    ros: ros,
    name: '/txt_msg',
    messageType: 'std_msgs/String'
});

cmd_vel_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_vel",
    messageType: 'geometry_msgs/Twist'
});

var jsp = new JOINTSTATEPUBLISHER.JointStatePublisher({
    ros : ros,
    divID : 'sliders'
});


var txt_listener2 = new ROSLIB.Topic({
    ros: ros,
    name: '/txt_msg',
    messageType: 'std_msgs/String'
});

cmd_vel_listener2 = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_vel2",
    messageType: 'geometry_msgs/Twist'
});


move2 = function(angular) {
    var twist2 = new ROSLIB.Message({
        angular: {
            x: 0,
            y: 0,
            z: angular
        }
    });
    cmd_vel_listener2.publish(twist2);
}



txt_listener2.subscribe(function(k) {
    document.getElementById("msg2").innerHTML = k.data;
    move2(0);
});

move = function(linear, angular) {
    var twist = new ROSLIB.Message({
        linear: {
            x: linear,
            y: 0,
            z: 0
        },

        angular: {
            x: 0,
            y: 0,
            z: angular
        }
    });
    cmd_vel_listener.publish(twist);
}



txt_listener.subscribe(function(m) {
    document.getElementById("msg").innerHTML = m.data;
    move(1, 0);
});


ros.on('connection', function() {
    document.getElementById("status").innerHTML = "Connected";
    document.getElementById("status").style.fontSize = "15px";
    document.getElementById("status").style.lineHeight = "2";



});

ros.on('error', function(error) {
    document.getElementById("status").innerHTML = "Error";
    document.getElementById("status").style.fontSize = "15px";
    document.getElementById("status").style.lineHeight = "2";
});

ros.on('close', function() {
    document.getElementById("status").innerHTML = "Closed";
    document.getElementById("status").style.fontSize = "15px";
    document.getElementById("status").style.lineHeight = "2";
});


createViewer2 = function() {
    var viewer = new MJPEGCANVAS.Viewer({
        divID: 'mjpeg2',
        host: 'localhost',
        width: 398,
        height: 210,
        topic: 'image_topic'
    });
}
createViewer3 = function() {
    var viewer = new MJPEGCANVAS.Viewer({
        divID: 'mjpeg3',
        host: 'localhost',
        width: 238,
        height: 142,
        topic: 'image_topic1'
    });
}

Joystick1 = function() {
    var options = {
        zone: document.getElementById('zone_joystick'),
        threshold: 0.1,
        position: { left: 50 + '%' },
        mode: 'static',
        size: 150,
        color: '#000000',
    };

    manager = nipplejs.create(options);

    linear_speed = 0;

    angular_speed = 0;

    self.manager.on('start', function(event, nipple) {
        console.log("Movement start");
        timer = setInterval(function() {
            move(linear_speed, angular_speed);
        }, 25);
    });

    self.manager.on('move', function(event, nipple) {
        console.log("Moving");
        max_linear = 5.0; // m/s

        max_angular = 2.0; // rad/s
        max_distance = 75.0; // pixels;
        linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance / max_distance;


        angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance / max_distance;
    });

    self.manager.on('end', function() {
        console.log("Movement end");
        if (timer) {
            clearInterval(timer);
        }
        self.move(0, 0);
    });
}

Joystick2 = function() {
    var options2 = {
        zone: document.getElementById('zone_joystick2'),
        threshold: 0.1,
        position: { left: 50 + '%' },
        mode: 'static',
        size: 150,
        color: 'orange',
    };

    manager2 = nipplejs.create(options2);

    // linear_speed2 = 0;

    angular_speed2 = 0;

    self.manager2.on('start', function(event2, nipple2) {
        console.log("Movement start2");
        timer2 = setInterval(function() {
            move2(angular_speed2);
        }, 25);
    });
    // self.manager2.on('move2')


    self.manager2.on('move', function(event2, nipple2) {
        console.log("Moving2");
        max_angular2 = 2.0; // rad/s
        max_distance2 = 75.0; // pixels;


        angular_speed2 = -Math.cos(nipple2.angle.radian) * max_angular2 * nipple2.distance / max_distance2;
    });

    self.manager2.on('end', function() {
        console.log("Movement end2");
        if (timer2) {
            clearInterval(timer2);
        }
        self.move2(0);
    });



}
window.onload = function() {
    Joystick1();
    Joystick2();
    createViewer2();
    createViewer3();
    var viewer = new ROS3D.Viewer({
        divID : 'urdf',
        width : 400,
        height : 300,
        antialias : true
      });
  
      // Add a grid.
      viewer.addObject(new ROS3D.Grid());
  
      // Setup a client to listen to TFs.
      var tfClient = new ROSLIB.TFClient({
        ros : ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0
      });
  
      // Setup the URDF client.
      var urdfClient = new ROS3D.UrdfClient({
        ros : ros,
        tfClient : tfClient,
        path : 'https://raw.githubusercontent.com/maxauto/urdf_robot_arm/main/max/',
        rootObject : viewer.scene,
        loader : ROS3D.COLLADA_LOADER_2
      });
    
}

function controller() {
    window.location = "http://127.0.0.1:5500/dist/controller.html";
}

function dashboard() {
    window.location = "http://127.0.0.1:5500/dist/dashboard.html";
}

function developers() {
    window.location = "http://127.0.0.1:5500/dist/developer.html";
}

function about() {
    window.location = "http://127.0.0.1:5500/dist/about.html";
}

function logout() {
    window.location = "http://127.0.0.1:5500/dist/index.html";
}