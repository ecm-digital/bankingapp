import { useState } from 'react';

import { Modal, Button, Input } from '@/components/ui';
import { Customer } from '@/types';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onSave: (updates: Partial<Customer>) => void;
}

export function EditContactModal({ isOpen, onClose, customer, onSave }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    email: customer.personalInfo.email,
    phone: customer.personalInfo.phone,
    street: customer.personalInfo.address.street,
    city: customer.personalInfo.address.city,
    postalCode: customer.personalInfo.address.postalCode,
    country: customer.personalInfo.address.country,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    // Phone validation (Polish format)
    const phoneRegex = /^(\+48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy format telefonu';
    }

    // Postal code validation (Polish format)
    const postalCodeRegex = /^\d{2}-\d{3}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = 'Nieprawidłowy format kodu pocztowego (XX-XXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updates: Partial<Customer> = {
      personalInfo: {
        ...customer.personalInfo,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      },
    };

    onSave(updates);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj Dane Kontaktowe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+48 XXX XXX XXX"
            required
          />
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Ulica i numer
          </label>
          <Input
            id="street"
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Kod pocztowy
            </label>
            <Input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              error={errors.postalCode}
              placeholder="XX-XXX"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Miasto
            </label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Kraj
          </label>
          <Input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button type="submit" variant="primary">
            Zapisz Zmiany
          </Button>
        </div>
      </form>
    </Modal>
  );
}
