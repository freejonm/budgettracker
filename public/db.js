let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });

};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Error: " + event.target.errorCode);
};

function saveRecord(record){
    console.log("saving off line");

    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    store.add(record);

    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");

    nameEl.value = "";
    amountEl.value = "";    
};

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(gatAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");

                const store = transaction.objectStore("pending");

                store.clear();
            });
        }
    }
}
