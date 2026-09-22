import api from '../services/api';

export const createUser = async (form) => {
  try {
    const response = await api.post('/create', form);
    console.log('usuario criado com sucesso:', response);
  } catch (error) {
    console.log('Erro ao criar usuário:', error);
   
  }
};


