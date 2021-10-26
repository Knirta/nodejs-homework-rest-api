const { nanoid } = require("nanoid");
const DB = require("./db");
const db = new DB("contacts.json");

const listContacts = async () => {
  return await db.read();
};

const getContactById = async (contactId) => {
  const contacts = await db.read();
  const [contact] = contacts.filter(
    (contact) => String(contact.id) === String(contactId)
  );
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await db.read();
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(contactId)
  );
  if (index !== -1) {
    const [contact] = contacts.splice(index, 1);
    await db.write(contacts);
    return contact;
  }
  return null;
};

const addContact = async (body) => {
  const contacts = await db.read();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  await db.write([...contacts, newContact]);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await db.read();
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(contactId)
  );
  if (index !== -1) {
    const contact = contacts[index];
    contacts[index] = { ...contact, ...body };
    await db.write(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
