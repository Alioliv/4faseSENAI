import React, { useState } from "react";
import api from "../services/api";

const FormUser = () => {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro({});

    try {
      const response = await api.post("/users", form);

      console.log(response.data);

      alert("Usuário cadastrado com sucesso!");

      setForm({
        nome: "",
        cpf: "",
        email: "",
        senha: "",
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        setErro({
          geral: error.response.data.message,
        });
      } else {
        setErro({
          geral: "Erro ao conectar com o servidor.",
        });
      }
    }
  };

  return (
    <div>
      <h1>Cadastro de Usuário</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="nome">Nome:</label>

          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="cpf">CPF:</label>

          <input
            type="text"
            id="cpf"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>

          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="senha">Senha:</label>

          <input
            type="password"
            id="senha"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Digite sua senha de 8 a 32 caracteres"
          />
        </div>

        {erro.geral && (
          <p style={{ color: "red" }}>
            {erro.geral}
          </p>
        )}

        <button type="submit">
          Cadastrar
        </button>

      </form>
    </div>
  );
};

export default FormUser;