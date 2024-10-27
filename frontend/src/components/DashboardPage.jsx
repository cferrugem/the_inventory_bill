import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [snacks, setSnacks] = useState([]); // Estado para armazenar snacks
  const [snackName, setSnackName] = useState(""); // Estado para o nome do snack
  const [ean, setEan] = useState(""); // Estado para o EAN
  const [quantity, setQuantity] = useState(0); // Estado para a quantidade
  const [minReplenishment, setMinReplenishment] = useState(0); // Estado para o mínimo de reposição
  const [eanMessage, setEanMessage] = useState(""); // Estado para a mensagem de validação do EAN
  const [eanMessageColor, setEanMessageColor] = useState(""); // Estado para a cor da mensagem
  const [stockChangeEan, setStockChangeEan] = useState(""); // Estado para o EAN no formulário de alteração de estoque
  const [changeAmount, setChangeAmount] = useState(0); // Estado para o valor de alteração de estoque
  const [minReplenishmentEan, setMinReplenishmentEan] = useState(""); // Estado para o EAN no formulário de alteração do mínimo de reposição
  const [newMinReplenishment, setNewMinReplenishment] = useState(0); // Estado para o novo valor de mínimo de reposição
  const [writeOffEan, setWriteOffEan] = useState(""); // Estado para o EAN no formulário de baixa de estoque
  const [writeOffAmount, setWriteOffAmount] = useState(0); // Estado para o valor de baixa de estoque
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa

  // Busca os snacks da API quando o componente é montado
  useEffect(() => {
    const fetchSnacks = async () => {
      const response = await fetch("http://localhost:3000/api/snacks");
      const data = await response.json();
      setSnacks(data);
    };
    fetchSnacks();
  }, []);

  // Manipula a adição de um novo snack
  const handleAddSnack = async (e) => {
    e.preventDefault();

    // Valida o EAN
    if (ean.length !== 13) {
      setEanMessage("O EAN deve ter exatamente 13 dígitos.");
      setEanMessageColor("text-red-600");
      return;
    }

    // Cria um novo objeto snack com os campos corretos, transformando o nome em maiúsculas
    const newSnack = {
      name: snackName.toUpperCase(), // Transforma o nome do snack em maiúsculas
      ean,
      quantity,
      min_replenishment: minReplenishment,
    };

    // Envia um POST para adicionar o snack
    const response = await fetch("http://localhost:3000/api/snacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSnack),
    });

    if (response.ok) {
      const addedSnack = await response.json();
      setSnacks((prev) => [...prev, addedSnack]);
      // Reseta os campos do formulário
      setSnackName("");
      setEan("");
      setQuantity(0);
      setMinReplenishment(0);
      setEanMessage(""); // Limpa a mensagem de erro
    }
  };

  // Manipula a alteração de estoque (aumento ou redução)
  const handleChangeStock = async (e) => {
    e.preventDefault();

    const snackToUpdate = snacks.find((snack) => snack.ean === stockChangeEan);
    if (!snackToUpdate) {
      alert("Snack não encontrado!");
      return;
    }

    const newQuantity = snackToUpdate.quantity + changeAmount;

    if (newQuantity < 0) {
      alert("A quantidade não pode ser negativa!");
      return;
    }

    // Envia um PUT para atualizar a quantidade de estoque do snack
    const response = await fetch(
      `http://localhost:3000/api/snacks/${snackToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: snackToUpdate.id, quantity: newQuantity }),
      }
    );

    if (response.ok) {
      const updatedSnack = await response.json();
      setSnacks((prev) =>
        prev.map((snack) =>
          snack.id === updatedSnack.id ? updatedSnack : snack
        )
      );
      setStockChangeEan("");
      setChangeAmount(0);
    } else {
      alert("Falha ao atualizar o estoque. Tente novamente.");
    }
  };

  // Manipula a alteração do mínimo de reposição
  const handleChangeMinReplenishment = async (e) => {
    e.preventDefault();

    const snackToUpdate = snacks.find(
      (snack) => snack.ean === minReplenishmentEan
    );
    if (!snackToUpdate) {
      alert("Snack não encontrado!");
      return;
    }

    // Envia um PUT para atualizar o mínimo de reposição
    const response = await fetch(
      `http://localhost:3000/api/snacks/${snackToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: snackToUpdate.id,
          min_replenishment: newMinReplenishment,
        }),
      }
    );

    if (response.ok) {
      const updatedSnack = await response.json();
      setSnacks((prev) =>
        prev.map((snack) =>
          snack.id === updatedSnack.id ? updatedSnack : snack
        )
      );
      setMinReplenishmentEan("");
      setNewMinReplenishment(0);
    } else {
      alert("Falha ao atualizar o mínimo de reposição. Tente novamente.");
    }
  };

  // Manipula a baixa de estoque
  const handleWriteOffStock = async (e) => {
    e.preventDefault();

    const snackToUpdate = snacks.find((snack) => snack.ean === writeOffEan);
    if (!snackToUpdate) {
      alert("Snack não encontrado!");
      return;
    }

    const newQuantity = snackToUpdate.quantity - writeOffAmount;

    if (newQuantity < 0) {
      alert("A quantidade da baixa não pode resultar em estoque negativo!");
      return;
    }

    // Envia um PUT para atualizar a quantidade de estoque do snack
    const response = await fetch(
      `http://localhost:3000/api/snacks/${snackToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: snackToUpdate.id, quantity: newQuantity }),
      }
    );

    if (response.ok) {
      const updatedSnack = await response.json();
      setSnacks((prev) =>
        prev.map((snack) =>
          snack.id === updatedSnack.id ? updatedSnack : snack
        )
      );
      setWriteOffEan("");
      setWriteOffAmount(0);
    } else {
      alert("Falha ao realizar a baixa de estoque. Tente novamente.");
    }
  };

  const handleEanChange = (e) => {
    const value = e.target.value;
    if (value.length <= 13 && /^\d*$/.test(value)) {
      setEan(value);
      const remainingDigits = 13 - value.length;

      if (value.length === 13) {
        setEanMessage("EAN completo!");
        setEanMessageColor("text-green-600");
      } else {
        setEanMessage(
          `Faltam ${remainingDigits} dígito${remainingDigits > 1 ? "s" : ""}.`
        );
        setEanMessageColor("text-black");
      }
    }
  };

  // Manipula a remoção de um snack
  const handleRemoveSnack = async (id) => {
    await fetch(`http://localhost:3000/api/snacks/${id}`, {
      method: "DELETE",
    });
    setSnacks((prev) => prev.filter((snack) => snack.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Converte para minúsculas para pesquisa insensível a maiúsculas
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-gray-800">
        Bem-vindo ao Painel de Insumos
      </h1>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg"></span>{" "}
        {/* Replace with actual user name */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
        >
          Sair
        </button>
      </div>
      <form
        onSubmit={handleAddSnack}
        className="mb-8 bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">Adicionar um Novo Snack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nome do Snack</label>
            <input
              type="text"
              value={snackName}
              onChange={(e) => setSnackName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">EAN</label>
            <input
              type="text"
              value={ean}
              onChange={handleEanChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <p className={`${eanMessageColor} text-sm`}>{eanMessage}</p>
          </div>
          <div>
            <label className="block mb-1">Estoque</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Ponto de Reposição</label>
            <input
              type="number"
              value={minReplenishment}
              onChange={(e) => setMinReplenishment(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Adicionar Insumo
        </button>
      </form>

      {/* Formulário de Alteração de Estoque */}
      <form
        onSubmit={handleChangeStock}
        className="mb-8 bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">Somar no Estoque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              value={stockChangeEan}
              onChange={(e) => setStockChangeEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Quantidade a Alterar</label>
            <input
              type="number"
              value={changeAmount}
              onChange={(e) => setChangeAmount(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Alterar Estoque
        </button>
      </form>

      {/* Formulário de Alteração do Mínimo de Reposição */}
      <form
        onSubmit={handleChangeMinReplenishment}
        className="mb-8 bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">
          Alterar Ponto de Reposição
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              value={minReplenishmentEan}
              onChange={(e) => setMinReplenishmentEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Novo Ponto de Reposição</label>
            <input
              type="number"
              value={newMinReplenishment}
              onChange={(e) => setNewMinReplenishment(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Alterar Ponto de Reposição
        </button>
      </form>

      {/* Formulário de Baixa de Estoque */}
      <form
        onSubmit={handleWriteOffStock}
        className="mb-8 bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">Dar Baixa no Estoque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              value={writeOffEan}
              onChange={(e) => setWriteOffEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Quantidade para Baixa</label>
            <input
              type="number"
              value={writeOffAmount}
              onChange={(e) => setWriteOffAmount(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Dar Baixa no Estoque
        </button>
      </form>

      <input
        type="text"
        placeholder="Pesquisar snack..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <h2 className="text-xl font-semibold mb-2">Insumos Atuais</h2>
      <div className="overflow-x-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {snacks
            .filter((snack) => snack.name.toLowerCase().includes(searchTerm))
            .map((snack) => (
              <div
                key={snack.id}
                className={`p-4 border border-gray-300 rounded-lg shadow-md ${
                  snack.quantity < snack.min_replenishment
                    ? "bg-red-50"
                    : "bg-white"
                }`}
              >
                <div className="mb-2">
                  <span className="font-bold">Descrição: </span>
                  <span
                    className={`${
                      snack.quantity < snack.min_replenishment
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {snack.name}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-bold">EAN: </span>
                  <span
                    className={`${
                      snack.quantity < snack.min_replenishment
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {snack.ean}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-bold">Estoque: </span>
                  <span
                    className={`${
                      snack.quantity < snack.min_replenishment
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {snack.quantity}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-bold">Ponto Mínimo de Reposição: </span>
                  <span
                    className={`${
                      snack.quantity < snack.min_replenishment
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {snack.min_replenishment}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveSnack(snack.id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remover
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
