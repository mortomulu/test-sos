import { useEffect, useState } from 'react'

type Contact = {
  id: number
  name: string
  phone: string
  email: string
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [form, setForm] = useState<Omit<Contact, 'id'>>({ name: '', phone: '', email: '' })
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('contacts')
    if (stored) {
      setContacts(JSON.parse(stored))
    }
  }, [])

  const getContactsFromStorage = (): Contact[] => {
    const stored = localStorage.getItem('contacts')
    return stored ? JSON.parse(stored) : []
  }

  const saveContactsToStorage = (data: Contact[]) => {
    localStorage.setItem('contacts', JSON.stringify(data))
    setContacts(data)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const existing = getContactsFromStorage()
    if (editId !== null) {
      const updated = existing.map(c => (c.id === editId ? { id: editId, ...form } : c))
      saveContactsToStorage(updated)
      setEditId(null)
    } else {
      const newContact: Contact = {
        id: Date.now(),
        ...form
      }
      saveContactsToStorage([...existing, newContact])
    }
    setForm({ name: '', phone: '', email: '' })
  }

  const handleEdit = (id: number) => {
    const existing = getContactsFromStorage()
    const contact = existing.find(c => c.id === id)
    if (contact) {
      setForm({ name: contact.name, phone: contact.phone, email: contact.email })
      setEditId(id)
    }
  }

  const handleDelete = (id: number) => {
    const existing = getContactsFromStorage()
    if (confirm('Yakin ingin menghapus kontak ini?')) {
      const filtered = existing.filter(c => c.id !== id)
      saveContactsToStorage(filtered)
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar Kontak</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Nama"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          placeholder="Nomor Telepon"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId !== null ? 'Update Kontak' : 'Tambah Kontak'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Telepon</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td className="border p-2">{contact.name}</td>
              <td className="border p-2">{contact.phone}</td>
              <td className="border p-2">{contact.email}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(contact.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
