import { useState, ChangeEvent } from 'react';

interface FormValues {
  [key: string]: string | number | readonly string[] | undefined
}

type FormUpdater = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleChange: FormUpdater = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return {
    values,
    handleChange,
    setValues,
  };
};

export default useForm;
