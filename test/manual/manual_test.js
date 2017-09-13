let verboseLogger = new PusherPlatform.ConsoleLogger(1) //Verbose logger 

let instance = new PusherPlatform.Instance({
    instanceId: CONSTANTS.instanceId,
    serviceName: 'feeds',
    serviceVersion: 'v1',
    logger: verboseLogger
});

let listeners = {
    onOpen: (headers) => {
        console.log(headers);
    },
    onSubscribe: () => console.log("onSubscribed"),
    onEvent: (event) => console.log(event),
    onError: (error) => console.log(error),
    onEnd: (error) => {
        console.log("onEnd");
        console.log(error);
    },
    onRetrying: () => console.log("onRetrying")
};

let resumableSubscribeOptions = {
    path: 'feeds/my-feed/items',
    listeners: listeners,
}

let requestOptions = {  
    method: "GET",
    path: "feeds/my-feed/items",
}

let postRequestOptions = {
    method: "POST",
    path: "feeds/my-feed/items",
    body: { items: [ {name: "kekec"}]},
}

// instance.request(postRequestOptions)
//     .then( response => {
//         console.log(response);
//     }).catch( error => {
//         console.log(error);
//     });
// function tryCancelRequest(){
//     //TODO:
// }

// let newResumableSubscription = instance.subscribeResuming(resumableSubscribeOptions);
let newRetryableSubscription = instance.subscribe(resumableSubscribeOptions);

// console.log(newResumableSubscription);
// let nonResumableSubscription = instance.subscribe(nonResumableSubscribeOptions);

function tryUnsubscribe(){
    // newResumableSubscription.unsubscribe();
    // newResumableSubscription.unsubscribe();   
    newRetryableSubscription.unsubscribe(); 

}

