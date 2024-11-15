let shoppingItems = [
    { name: 'Milk', amount: 2 },
    { name: 'Bread', amount: 1 },
    { name: 'Butter', amount: 3 }
];

// Next.js API Route
export default function handler(req, res) {
    const { method } = req;
    const { name } = req.query;

    switch (method) {
        case 'GET':
            if (name) {
                // GET a shopping item by name
                const item = shoppingItems.find(item => item.name.toLowerCase() === name.toLowerCase());
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.status(404).json({ message: 'Item not found.' });
                }
            } else {
                // GET all shopping items
                res.status(200).json(shoppingItems);
            }
            break;

        case 'POST':
            // ADD a new shopping item
            const { name: newItemName, amount } = req.body;
            if (!newItemName || amount == null) {
                return res.status(400).json({ message: 'Name and amount are required.' });
            }

            const existingItem = shoppingItems.find(item => item.name.toLowerCase() === newItemName.toLowerCase());
            if (existingItem) {
                return res.status(409).json({ message: 'Item already exists.' });
            }

            const newItem = { name: newItemName, amount };
            shoppingItems.push(newItem);
            res.status(201).json(newItem);
            break;

        case 'PUT':
            // UPDATE an existing shopping item by name
            if (!name) {
                return res.status(400).json({ message: 'Item name is required.' });
            }

            const { amount: updatedAmount } = req.body;
            if (updatedAmount == null) {
                return res.status(400).json({ message: 'Amount is required.' });
            }

            const itemToUpdate = shoppingItems.find(item => item.name.toLowerCase() === name.toLowerCase());
            if (itemToUpdate) {
                itemToUpdate.amount = updatedAmount;
                res.status(200).json(itemToUpdate);
            } else {
                res.status(404).json({ message: 'Item not found.' });
            }
            break;

        case 'DELETE':
            // DELETE a shopping item by name
            if (!name) {
                return res.status(400).json({ message: 'Item name is required.' });
            }

            const initialLength = shoppingItems.length;
            shoppingItems = shoppingItems.filter(item => item.name.toLowerCase() !== name.toLowerCase());

            if (shoppingItems.length < initialLength) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'Item not found.' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
