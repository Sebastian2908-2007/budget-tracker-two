// create a variable to hold our indexeddb connection
let db;
// establish a connection to indexeddb database
const request = indexedDB.open('budget_tracker',1);

// this event will emit if ther eis a version change
request.onupgradeneeded = function(event) {
    // save ref to indexeddb data base
    const db = event.target.result;
    // create an object store (table) called transaction set it to auto increment its id
    db.createObjectStore('new_transaction',{autoIncrement: true });

};

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        // funtion to save transaction to our backend
         uploadTransaction();
    }
};

request.onerror = function(event) {
    // log error if ther is one
  console.log(event.target.erroCode);
};

function saveRecord(record) {
    // open new transaction with readwrite permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access the object store for transaction
    const transactionObjectStore = transaction.objectStore('new_transaction');

    // add record to ystore with the add method()
    transactionObjectStore.add(record);
};

function uploadTransaction() {
   console.log(db);
   // open a transaction on your db
   const transaction = db.transaction(['new_transaction'], 'readwrite');

   // access the objectStore
   const transactionObjectStore = transaction.objectStore('new_transaction');

   // get all records from the store and set as variable
   const getAll = transactionObjectStore.getAll();
   
   // upon a successfull .getAll(); execution run this function
   getAll.onsuccess = function() {
       if (getAll.result.length > 0) {
           fetch('/api/transaction',{
               method: 'POST',
               body: JSON.stringify(getAll.result),
               headers: {
                   Accept: 'application/json, text/plain, */*',
                   "Content-Type": 'application/json'
               }
           })
           .then(response => response.json())
           .then(serverResponse => {
               if(serverResponse.message) {
                   throw new Error(serverResponse);
               }
               // open one more transaction
               const transaction = db.transaction(['new_transaction'], 'readwrite');
               // access the new_transaction object store
               const transactionObjectStore = transaction.objectStore('new_transaction');
               // clear all items from the store
               transactionObjectStore.clear();
               alert('all transactions saved and submitted!');
           })
           .catch(err => {
               console.log(err);
           })
       }
   }
};