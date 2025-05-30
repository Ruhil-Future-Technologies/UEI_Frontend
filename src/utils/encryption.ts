// Custom encryption key - should be stored in environment variables
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'Superuser@123456';

// Helper function to convert string to ASCII codes
const stringToAscii = (str: string): number[] => {
  return str.split('').map(char => char.charCodeAt(0));
};

// Helper function to convert ASCII codes to string
const asciiToString = (codes: number[]): string => {
  return String.fromCharCode(...codes);
};

// Custom XOR encryption
export const encryptData = (data: string): string => {
  try {
    console.log("encript",ENCRYPTION_KEY)
    // Convert data and key to ASCII codes
    const dataCodes = stringToAscii(data);
    const keyCodes = stringToAscii(ENCRYPTION_KEY);
    
    // Perform XOR operation
    const encryptedCodes = dataCodes.map((code, index) => {
      const keyCode = keyCodes[index % keyCodes.length];
      return code ^ keyCode;
    });
    
    // Convert encrypted codes to base64 string
    const encryptedString = btoa(asciiToString(encryptedCodes));
    return encryptedString;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Custom XOR decryption
export const decryptData = (encryptedData: string): string => {
  try {
    // Decode base64 string
    const decodedString = atob(encryptedData);
    
    // Convert decoded string to ASCII codes
    const encryptedCodes = stringToAscii(decodedString);
    const keyCodes = stringToAscii(ENCRYPTION_KEY);
    
    // Perform XOR operation (XOR is symmetric, so same operation decrypts)
    const decryptedCodes = encryptedCodes.map((code, index) => {
      const keyCode = keyCodes[index % keyCodes.length];
      return code ^ keyCode;
    });
    
    // Convert decrypted codes back to string
    return asciiToString(decryptedCodes);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}; 
