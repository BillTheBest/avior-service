var toClient = require('../../toClient.js');
var http = require('http');

// Function calls the REST API depending on the call that is chosen from the find, create, and destroy switch case clauses below.
var restCall = function(apiMethod,apiPath){
        var self = this;
        return function(options,cb){
                var rawPath = apiPath;
                if (options.args){
                        for (arg in options.args){
                                apiPath = apiPath.replace(/:[A-Za-z]+:/, options.args[arg]);
                        }
                }
                //console.log(apiPath);
                if(sails.controllers.main.hostname){
                  var host = sails.controllers.main.hostname;
                }
                opts = {method:apiMethod,hostname:host,port:8080,path:apiPath};
                
                req = http.request(opts, toClient(this,options.call,options,cb));
                if (options.data) {
                        req.write(JSON.stringify(options.data));
                        console.log("DATA: " + options);
                        console.log("Got here");
                }
                apiPath = rawPath;
                req.end();
        }
};

 
module.exports = {
    
    TO_OFP : {
	// name-in-floodlight: name-in-models
	//Hosts Information
    Stats: 'Stats',
    DPID: 'DPID',
    mac: 'MAC_Address',
	ipv4: 'IP_Address',
	vlan: 'VLAN_ID',
	attachmentPoint: 'Attached_To',
	switchDPID: 'DPID',
	port: 'Port',
    idleTimeout: 'IdleTimeout', 
    hardTimeout: 'HardTimeout',
    tableId: 'TableID',
    durationSeconds:'DurationSeconds', 
    durationNanoseconds:'DurationNanoSeconds',
    packetCount:'PacketCount',
    byteCount:'ByteCount',
    flowCount:'FlowCount',
	lastSeen: 'Last_Seen',
    //Uptime Information
    systemUptimeMsec: 'Uptime_msec',
    //Switch Description Information(Shortened to Desc in files)
    manufacturerDescription:'Manufacturer',
    hardwareDescription:'Hardware',
    softwareDescription:'Software',
    serialNumber:'SerialNum',
    //Switch Features information
    portNumber: "PortNum",
    receivePackets: "RXPackets",
    transmitPackets: "TXPackets",
    receiveBytes: "RXBytes",
    transmitBytes:"TXBytes",
    receiveDropped:"RXDrops",
    transmitDropped:"TXDrops",
    receiveErrors: "RXErrors",
    transmitErrors: "TXErrors",
    receiveFrameErrors: "RXFrameErr",
    receiveOverrunErrors: "RXOverrunErr",
    receiveCRCErrors: "RXCrcErr",
    collisions: "Collisions",
    //Switch Port Information
    //I assume that this will use PortNum from switch features above
    name: "PortName",
    //Keep in mind that it seems that a state of 512 means that the port is up and a state of 513 means that the port is down
    state: "PortState",
    currentFeatures: "CurrentFeatures",
    advertisedFeatures: "AdvertisedFeatures",
    supportedFeatures: "SupportedFeatures",
    peerFeatures: "PeerFeatures",
    config: "Config",
    hardwareAddress: "HardwareAddress",
    //TableStats
    activeCount: "ActiveCount",
    wildcards: "Wildcards",
    tableId: "TableID",
    maximumEntries: "MaxEntries",
    lookupCount: "LookupCount",
    matchedCount: "MatchedCount",
    //name: "Name",
    //Topology
    "src-switch": "SourceDPID",
    "src-port": "SourcePortNum",
    "src-port-state": "SourcePortState",
    "dst-switch": "DestinationDPID",
    "dst-port": "DestinationPortNum",
    "dst-port-state": "DestinationPortState",
    total: "TotalMemory",
    free: "FreeMemory",
    healthy: "Health",
    type: "Type",
    //SwitchFeatures
    connectedSince: "Connected_Since",
    actions: "Actions",
    buffers: "Buffers",
    capabilities: "Capabilities",
    datapathId: "Datapath",
    ports: "Ports",
    dpid: "DPID",
    healthy: "Healthy",
    //type: "LinkType",
    total: "TotalMemory",
    free: "FreeMemory",
    healthy: "Health",
    //Match Criteria
    match: "Match",
    dataLayerDestination: "DataLayerDestination",
    dataLayerSource: "DataLayerSource",
    dataLayerType: "DataLayerType",
    dataLayerVirtualLan: "DataLayerVLAN",
    dataLayerVirtualLanPriorityCodePoint: "DataLayerVLAN_PCP",
    inputPort: "InputPort",
    networkDestination: "NetworkDestination",
    networkDestinationMaskLen: "NetworkDestinationMaskLen",
    networkProtocol: "NetworkProtocol",
    networkSource: "NetworkSource",
    networkSourceMaskLen: "NetworkSourceMaskLen",
    networkTypeOfService: "NetworkTOS",
    transportDestination: "TransportDestination",
    transportSource: "TransportSource",
    wildcards: "Wildcards",
    //Ports
    Ports: 'Ports',
    //Flows
    Link: 'Link',
    bufferId: 'BufferID',
    cookie: 'Cookie',
    idleTimeout: 'IdleTimeout',
    hardTimeout: 'HardTimeout',
    //command: 
    outPort: 'OutPort',
    actions: 'Actions',
    port: 'PortNum',
    priority: 'Priority',
    flags: 'Flags',
    Flow: "Flow",
    Flows: "Flows",
    result: "Result",
    status: "Status",
    details: "Details",
    Name: "Name",
    /*loaded: "Loaded",
    provides: "Provides",
    depends: "Depends"*/ 
},

    
    postData: {},
    
    dpid: '',
    
	identity: 'floodlight',
    
     drop: function() {
        
        
    },

        registerConnection: function (conn, coll, cb) {
                if (!conn.port) { conn.port = 8080; }
                if (!conn.method) { conn.method = 'GET'; }
                cb();
        },
    
        teardown: function(connectionName, cb) {
          if(!sails.config.connections[connectionName]) return cb();
          delete sails.config.connections[connectionName];
          cb();
        },

        find: function (conn, coll, options, cb) { // Holds all of the REST calls that return data
            switch (coll){   
                //core
                case 'flow': return this.getFlows({args:['all'],call:coll},cb);
                        break;
                case 'switchports': return this.getSwitchPorts({args:[this.dpid ? this.dpid : 'all'],call:coll},cb); //dpid here
                        break;
                case 'tablestats': return this.getTableStats({args:['all'],call:coll},cb);
                        break;
                case 'topology': return this.getTopologyLinks({args:['all'],call:coll},cb);
                        break;
                case 'host': return this.getHosts({call:coll},cb);
                        break;
                //case 'switchfeatures': return this.getSwitchFeatures({args:['all'],call:coll},cb);
                        //break;
                case 'flowstats': return this.getFlowStats({args:['all'],call:coll},cb);
                        break;
                case 'switchdesc': return this.getSwitchDesc({args:['all'],call:coll},cb);
                        break;
                case 'queue': return this.getQueueStats({args:['all'],call:coll},cb);
                        break;
                case 'aggregate': return this.getAggregateStats({args:['all'],call:coll},cb);
                        break;
                case 'switch': return this.getSwitches({args:['all'],call:coll},cb);
                        break;
                        
                
                //fl only
                case 'uptime': return this.getUptime({args:['all'],call:coll},cb);
                        break;
                case 'memory': return this.getMemory({args:['all'],call:coll},cb);
                        break;
                case 'health': return this.getHealth({args:['all'],call:coll},cb);
                        break;
                case 'topologyclusters':return this.getTopologyClusters({args:['all'],call:coll},cb);
                        break;
                case 'topologyexternallinks':return this.getTopologyExternalLinks({args:['all'],call:coll},cb);
                        break;
               
                case 'clearflows':return this.clearFlows({args:['all'],call:coll},cb);
                         break;
                case 'modules':return this.getModules({args:[],call:coll},cb);
                         break;
               //case 'alterflow':return this.postFlow({data:{},call:coll},cb);
                case 'alterflow':return this.getFlows({args:['all'],call:coll},cb);
                        break;
		        default: return this.pluginFind(conn, coll, options, cb);
                        break;
                }    
            
        },
    
        pluginFind: function(conn, coll, options, cb){
            return cb(); //if no plugins, default behavior
        },
    
        
        create: function (conn, coll, options, cb) { //The Rest Call that will be called if a flow is being created
            console.log("POSTED DATA: " + JSON.stringify(options.data) + '\n')
                switch (coll){
                case 'alterflow': // fall-through!
                case 'flow':
                        flowData = options.data;
                        resp = options.response;
                        if(sails.controllers.main.hostname){
                                  var host = sails.controllers.main.hostname;
                                }
                        var opts = {method:'POST',hostname:host,port:8080,path:'/wm/staticflowpusher/json'};
                        //var opts = {method:'POST',hostname:'10.11.17.40',port:8080,path:'/wm/staticflowpusher/json'};
                        var requ = http.request(opts,  function(res) {
                          console.log('STATUS: ' + res.statusCode);
                          console.log('HEADERS: ' + JSON.stringify(res.headers));
                          res.setEncoding('utf8');
                          res.on('data', function (chunk) {
                            console.log('BODY: ' + chunk);
                            resp.send(chunk);
                          });
                        });
                        console.log(JSON.stringify(flowData));
                        requ.write(JSON.stringify(flowData));
                        requ.end();
                        break;
		        default: return this.pluginCreate(conn, coll, options, cb);
                }
        },
    
        pluginCreate: function(conn, coll, options, cb){
            return cb(); //if no plugins, default behavior
        },
    
        update: function (conn, coll, options, cb) {
            return this.pluginUpdate(conn, coll, options, cb);    
        },
    
        pluginUpdate: function(conn, coll, options, cb){
            return cb(); //if no plugins, default behavior
        },
    
        destroy: function (conn, coll, options, cb) {// Rest Call that will be called if there is a delete flow
             console.log("DELETED DATA: ");
                switch(coll){
                case 'alterflow':
                case 'flow':
                var flowData = options.data;
            if(sails.controllers.main.hostname){
              var host = sails.controllers.main.hostname;
            }
            var res = res;
            var options = {
                hostname:host, 
                port:8080, 
                path:'/wm/staticflowpusher/json',
                method:'DELETE'};

            var req = http.request(options, function(res) {
              console.log('\n' + 'STATUS: ' + res.statusCode + '\n');
              console.log('HEADERS: ' + JSON.stringify(res.headers) + '\n');
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk + '\n');
              });
            });

            req.on('error', function(e) {
              console.log('problem with request: ' + e.message + '\n');
            });

            var realData; //temporary fix until find out what front-end parsing is doing
            for(realData in flowData){
                break;
            }

            console.log(realData);
            req.write(realData);
            req.end(); 
            break;
                default:  return this.pluginDestroy(conn, coll, options, cb);
                }
        },
    
    
        pluginDestroy: function(conn, coll, options, cb){
            return cb(); //if no plugins, default behavior
        },
    
        normalize: function (obj) {// This is taking in the returned input from the controller and returning it in a manner that aviors interface will understand wel enough to output to the front end.
                var normalizedField;
                var normalizedObj;
                if (!obj){ return 0; } //to fix: this applies to both "null" and "0" responses.
		        if (obj.constructor === Array) {
			         normalizedObj = [];
			         for (i in obj) {
				        normalizedObj.push(this.normalize(obj[i]))
			         }
		        } else if (obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean || obj === 0) {
                        normalizedObj = obj;
		        } else {
			         normalizedObj = {};
			         for (fromField in this.TO_OFP) {
				        if (obj[fromField] || obj[fromField] === 0 || obj[fromField] === "") { //added so that "0" responses are not discarded
		 	        	       toField = this.TO_OFP[fromField];
	                           normalizedObj[toField] = this.normalize(obj[fromField]); //Nested structs? Probably handled recursively
				        }
			         }
                }
                return normalizedObj;
        },
    
    
        dpidParse: function (current, obj) { //This function will fix a parsing issue that occurs when the DPID is given to us as a property name. Since to display the information we need to have the name of the property. To fix this this function take the DPID and sets it as the property and set DPID as the property name. Giving us a static property name no matter what the DPID
                arr = [];
                    
                if(current === 'switchports'){   
                for (dpid in obj){
                        innerObj = {};
                        Ports = [];
                        innerObj.DPID = dpid;
                        //innerObj.Ports = Ports;
                        //arr.push(innerObj);
                        innerArr = obj[dpid];
                    
                        if(innerArr.constructor === Array && innerArr.length > 1){
                            for (i=0;i<innerArr.length;i++){
                            ob = innerArr[i]; //TODO: Iterate
                            portObj = {};
                            for (key in ob){
                                portObj[key] = ob[key];
                                }
                            Ports.push(portObj);
                            innerObj.Ports = Ports;
                            }
                        }
                    
                        else if(innerArr.constructor === Array && innerArr.length < 1){
                            innerObj.Ports = [];   
                        } //what if length = 1?
                    
                        arr.push(innerObj);
                    }
                      return arr;
                }
            
                else if(current === 'switchdesc' || current === 'aggregate'){
                    for (dpid in obj){
                        innerObj = {};
                        innerObj.DPID = dpid;
                        Desc = obj[dpid];
                        Desc = Desc[0];
                        for (key in Desc){
                            innerObj[key] = Desc[key];
                        }
                        arr.push(innerObj);
                    }
                    return arr;
                }
            
             else if(current === 'switchfeatures'){
                 for (dpid in obj){
                        innerObj = {};
                        innerObj.DPID = dpid;
                        Features = obj[dpid];
                        for (key in Features){
                            innerObj[key] = Features[key];
                        }
                        arr.push(innerObj);
                    }
                    return arr;
             }

            else if(current === 'flow' || current === 'alterflow'){
                 for (dpid in obj){
                     innerObj = {};
                     Flows = [];
                     innerObj.DPID = dpid;
                     Features = obj[dpid];
                     
                     for (flow in Features){
                        flowObj = {};
                        flowObj.Flow = flow;
                        Features = obj[dpid][flow];
                         
                        for (key in Features){
                            flowObj[key] = Features[key];
                        }
                        Flows.push(flowObj);
                     }
                     innerObj.Flows = Flows;
                     arr.push(innerObj);
                    }
                    return arr;
             }
            
             else if(current === 'flowstats'){   
                for (dpid in obj){
                        innerObj = {};
                        Flows = [];
                        innerObj.DPID = dpid;
                        //innerObj.Ports = Ports;
                        //arr.push(innerObj);
                        innerArr = obj[dpid];
                    
                        if(innerArr.constructor === Array && innerArr.length >= 1){
                            for (i=0;i<innerArr.length;i++){
                            ob = innerArr[i]; //TODO: Iterate
                            flowObj = {};
                            for (key in ob){
                                flowObj[key] = ob[key];
                                }
                            Flows.push(flowObj);
                            innerObj.Flows = Flows;
                            }
                        }
                        arr.push(innerObj);
                    }
                      return arr;
                }
            else if(current === 'modules'){
                for (Name in obj){
                    innerObj = {};
                    innerObj.Name = Name;
                    Features = obj[Name];
                        for (key in Features){
                            innerObj[key] = Features[key];
                        }
                        arr.push(innerObj);
                    }
                    return arr;
                }
            else{
                this.pluginParse(current, obj);
                return obj;
            }
        
        },
    
    pluginParse: function(current, obj){
        return obj; //If no plugins, default behavior
    },
  
    getSwitchDesc: restCall('GET','/wm/core/switch/:arg:/desc/json'),    //"all" returns switch dpid objects
    getSwitchFeatures: restCall('GET','/wm/core/switch/:arg:/features/json'),   //"all" returns switch dpid objects
    getSwitchPorts: restCall('GET','/wm/core/switch/:arg:/port/json'), //"all" returns switch dpid objects
	getQueueStats: restCall('GET', '/wm/core/switch/:arg:/queue/json'), //"all" returns switch dpid objects
	getFlowStats: restCall('GET','/wm/core/switch/:arg:/flow/json'), //"all" returns switch dpid objects
	getAggregateStats: restCall('GET','/wm/core/switch/:arg:/aggregate/json'),  //"all" returns switch dpid objects
	getTableStats: restCall('GET','/wm/core/switch/:arg:/table/json'),  //"all" returns switch dpid objects
	getCounters: restCall('GET','/wm/core/counter/:arg:/:arg:/json'), //an object with dynamic counter titles as property names
    getTopologyClusters: restCall('GET','/wm/topology/switchclusters/json'), //an object with switch dpids as property names
    getFlows: restCall('GET','/wm/staticflowpusher/list/:arg:/json'),  //an object with switch dpids as property names
    
    getSwitches: restCall('GET','/wm/core/controller/switches/json'), //array of unnamed Switch objects
    getSummary: restCall('GET','/wm/core/controller/summary/json'), //one unnamed Controller object  
    getHosts: restCall('GET','/wm/device/'), //array of unnamed Host objects
    getTopologyLinks: restCall('GET','/wm/topology/links/json'), //an array of unnamed objects, each with a Topology link
   
    getUptime: restCall('GET','/wm/core/system/uptime/json'), //one unnamed object containing uptime
    getMemory: restCall('GET','/wm/core/memory/json'), //an unnamed object with memory
    getHealth: restCall('GET','/wm/core/health/json'), //an unnamed object with health
    getTopologyExternalLinks: restCall('GET','/wm/topology/external-links/json'), //unknown
    clearFlows: restCall('GET','/wm/staticflowpusher/clear/:arg:/json'), //unknown
    
    postFlow: restCall('POST','/wm/staticflowpusher/json'),
    delFlow: restCall('DELETE','/wm/staticflowpusher/json'),
    
    
	//////////////// PLACEHOLDER FOR VIRTUAL NETWORK CALLS
    
    getModules: restCall('GET','/wm/core/module/loaded/json'),

}
