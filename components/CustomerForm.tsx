'use client'

import useForm from '../hooks/useForm';

export default function ControlNavbar() {

    const { values, handleChange } = useForm({
        company: '',
        firstName: '',
        surname: '',
        address: '',
        town: '',
        county: '',
        postcode: '',
        email: '',
        phoneNumber: '',
      });
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(values); // You can use the form data here
      };
    
      return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-slate-300">Add Customer</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
             <div className="mb-4">
            <label htmlFor="company" className="block text-gray-600 text-sm font-semibold mb-2">Company:</label>
            <input
                type="text"
                id="company"
                name="company"
                value={values.company}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />
    
            <label htmlFor="firstName" className="block text-gray-600 text-sm font-semibold mb-2">First Name:</label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="surname" className="block text-gray-600 text-sm font-semibold mb-2">Surname:</label>
            <input
                type="text"
                id="surname"
                name="surname"
                value={values.surname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="address" className="block text-gray-600 text-sm font-semibold mb-2">Address:</label>
            <textarea
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            ></textarea>

            <label htmlFor="town" className="block text-gray-600 text-sm font-semibold mb-2">Town:</label>
            <input
                type="text"
                id="town"
                name="town"
                value={values.town}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="county" className="block text-gray-600 text-sm font-semibold mb-2">County:</label>
            <input
                type="text"
                id="county"
                name="county"
                value={values.county}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="postcode" className="block text-gray-600 text-sm font-semibold mb-2">Postcode:</label>
            <input
                type="text"
                id="postcode"
                name="postcode"
                value={values.postcode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-2">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />

            <label htmlFor="phoneNumber" className="block text-gray-600 text-sm font-semibold mb-2">Phone Number:</label>
            <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
            />
            </div>
    
          <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded hover:text-[#fffd78] focus:outline-none focus:shadow-outline-blue">Submit</button>
        </form>
        </div>
      );
}