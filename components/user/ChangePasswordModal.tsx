'use client';

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { useState } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  
  // Password field states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility toggle states
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // Validation and messages
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Toggle visibility for each password field
  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Validate password strength
  const validatePassword = (password: string): string => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }

    return '';
  };

  // Handle new password change with validation
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    const validationError = validatePassword(password);
    setPasswordError(validationError);

    // Check if new password matches confirmation
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
    } else {
      setPasswordMatchError('');
    }
  };

  // Handle confirm password change with matching check
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirm = e.target.value;
    setConfirmPassword(confirm);

    // Check if passwords match
    if (newPassword !== confirm) {
      setPasswordMatchError('Passwords do not match.');
    } else {
      setPasswordMatchError('');
    }
  };

  // Function to change password
  const handleChangePassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    try {
      const response = await fetch('/api/account/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.error || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while changing the password.');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Change Password</ModalHeader>
            <ModalBody>

              {/* Current Password Input */}
              <div className="my-4">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    id="current-password"
                    placeholder="Enter your current password"
                    type={currentPasswordVisible ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={toggleCurrentPasswordVisibility}
                  >
                    {currentPasswordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} />}
                  </span>
                </div>
              </div>

              {/* New Password Input with validation and visibility toggle */}
              <div className="my-4">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    placeholder="Enter your new password"
                    type={newPasswordVisible ? 'text' : 'password'}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {newPasswordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} />}
                  </span>
                </div>
                {passwordError && <p className="text-red-500">{passwordError}</p>}
              </div>

              {/* Confirm New Password Input with visibility toggle */}
              <div className="my-4">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    placeholder="Confirm your new password"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} />}
                  </span>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                {passwordMatchError && <p className="text-red-500 mt-4">{passwordMatchError}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleChangePassword}>
                Change Password
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
