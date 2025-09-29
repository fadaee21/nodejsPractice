// contactManager.js
const fs = require("fs");
const readline = require("readline");
const fileName = "contacts.json";

// --- Helpers ---
function readContacts() {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, "[]");
  }
  const data = fs.readFileSync(fileName, "utf-8").trim();
  if (data === "") {
    return [];
  }
  return JSON.parse(data);
}

function saveContacts(contacts) {
  fs.writeFileSync(fileName, JSON.stringify(contacts, null, 2));
}

function showContacts() {
  const contacts = readContacts();
  if (contacts.length === 0) {
    console.log("📭 No contacts found");
  } else {
    console.log("📒 Contacts:");
    contacts.forEach((c, i) => console.log(`${i + 1}. ${c.firstName} ${c.lastName}`));
  }
}

function addContact(firstName, lastName) {
  const contacts = readContacts();
  contacts.push({ firstName, lastName });
  saveContacts(contacts);
  console.log(`✅ Added: ${firstName} ${lastName}`);
}

function deleteContact(index) {
  const contacts = readContacts();
  if (index < 1 || index > contacts.length) {
    console.log("❌ Invalid contact index");
    return;
  }
  const removed = contacts.splice(index - 1, 1);
  saveContacts(contacts);
  console.log(`🗑️ Deleted: ${removed[0].firstName} ${removed[0].lastName}`);
}

// --- CLI ---
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log("\n--- Contact Manager ---");
  console.log("1. Show all contacts");
  console.log("2. Add a contact");
  console.log("3. Delete a contact");
  console.log("4. Exit");
  rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      showContacts();
      showMenu();
      break;
    case "2":
      rl.question("Enter first name: ", (firstName) => {
        rl.question("Enter last name: ", (lastName) => {
          addContact(firstName, lastName);
          showMenu();
        });
      });
      break;
    case "3":
      showContacts();
      rl.question("Enter contact number to delete: ", (num) => {
        deleteContact(parseInt(num));
        showMenu();
      });
      break;
    case "4":
      console.log("👋 Goodbye!");
      rl.close();
      break;
    default:
      console.log("❌ Invalid option");
      showMenu();
  }
}

showMenu();
