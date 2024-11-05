import Customer from '../models/customer.model.js';



export const addCustomer = async (req, res) => {

    const { phoneNumber  , Email , name} = req.body; 

    try {
        const customer = await Customer.create({ phoneNumber ,Email , name});
    res.status(201).json(customer); 
    
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
        
    }

};