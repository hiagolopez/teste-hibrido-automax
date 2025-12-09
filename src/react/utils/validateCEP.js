export const validateCEP = (cep) => {
  if (!cep) return false;
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

export const formatCEP = (value) => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 5) {
    return cleanValue;
  }
  return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
};

