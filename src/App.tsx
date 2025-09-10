import { useState } from "react";
import "./App.css";

interface FormData {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  numero: string;
  cep: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: "",
    numero: "",
    cep: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [emailValido, setEmailValido] = useState<boolean | null>(null);
  const [senhaValida, setSenhaValida] = useState<boolean | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // --- Máscaras ---
  function formatCPF(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 11);
    return v
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatCEP(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 8);
    return v.replace(/(\d{5})(\d)/, "$1-$2");
  }

  function formatTelefone(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 2) return v;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    let rawValue = e.target.value;

    if (name === "cpf") rawValue = formatCPF(rawValue);
    if (name === "cep") rawValue = formatCEP(rawValue);
    if (name === "telefone") rawValue = formatTelefone(rawValue);

    const updated: FormData = { ...formData, [name]: rawValue };
    setFormData(updated);

    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValido(regex.test(rawValue));
    } else {
      if (updated.email !== "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValido(regex.test(updated.email));
      }
    }

    const senhasCoincidem =
      updated.senha !== "" && updated.senha === updated.confirmarSenha;
    setSenhaValida(
      updated.senha === "" && updated.confirmarSenha === "" ? null : senhasCoincidem
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValido) {
      alert("Digite um e-mail válido!");
      return;
    }
    if (!senhaValida) {
      alert("As senhas não coincidem!");
      return;
    }
    setModalAberto(true);
  }

  function concluirCadastro() {
    // Aqui você pode adicionar envio para backend ou outras ações
    setModalAberto(false);
    alert("Cadastro concluído com sucesso!");
  }

  return (
    <div className="container">
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit} className="form">
        {/* Dados Pessoais */}
        <div className="section">
          <h2>Dados Pessoais</h2>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
            />
          </label>

          <label>
            CPF:
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </label>

          <label>
            Telefone:
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </label>

          <div className="row">
            <label>
              Endereço:
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua / Av."
              />
            </label>

            <label>
              Número:
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Nº"
                maxLength={8}
              />
            </label>
          </div>

          <label>
            CEP:
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00.000-000"
              maxLength={9}
            />
          </label>
        </div>

        {/* Dados de Acesso */}
        <div className="section">
          <h2>Dados de Acesso</h2>
          <label>
            E-mail:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@exemplo.com"
            />
            {emailValido === false && (
              <small style={{ color: "red" }}>E-mail inválido</small>
            )}
            {emailValido === true && (
              <small style={{ color: "green" }}>E-mail válido</small>
            )}
          </label>

          <label>
            Senha:
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
            />
          </label>

          <label>
            Confirmar senha:
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Confirme sua senha"
            />
            {senhaValida === false && (
              <small style={{ color: "red" }}>As senhas não coincidem</small>
            )}
            {senhaValida === true && (
              <small style={{ color: "green" }}>As senhas coincidem</small>
            )}
          </label>

          {/* Botão Cadastrar aqui, após os campos de Dados de Acesso */}
          <button type="submit" className="btn-cadastrar">
            Cadastrar
          </button>
        </div>
      </form>

      {/* Modal */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Resumo do Cadastro</h2>
            <p><strong>Nome:</strong> {formData.nome || "-"}</p>
            <p><strong>CPF:</strong> {formData.cpf || "-"}</p>
            <p><strong>Telefone:</strong> {formData.telefone || "-"}</p>
            <p><strong>Endereço:</strong> {formData.endereco || "-"}</p>
            <p><strong>Número:</strong> {formData.numero || "-"}</p>
            <p><strong>CEP:</strong> {formData.cep || "-"}</p>
            <p><strong>E-mail:</strong> {formData.email || "-"}</p>
            <button onClick={concluirCadastro} className="btn-concluir">
              Concluir Cadastro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
