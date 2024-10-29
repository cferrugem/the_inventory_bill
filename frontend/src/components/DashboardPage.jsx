import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [snacks, setSnacks] = useState([]);
  const [snackName, setSnackName] = useState("");
  const [ean, setEan] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [minReplenishment, setMinReplenishment] = useState(0);
  const [eanMessage, setEanMessage] = useState("");
  const [eanMessageColor, setEanMessageColor] = useState("");
  const [stockChangeEan, setStockChangeEan] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);
  const [minReplenishmentEan, setMinReplenishmentEan] = useState("");
  const [newMinReplenishment, setNewMinReplenishment] = useState(0);
  const [writeOffEan, setWriteOffEan] = useState("");
  const [writeOffAmount, setWriteOffAmount] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSnacks = async () => {
    const response = await fetch("http://localhost:3000/api/snacks");
    const data = await response.json();
    setSnacks(data);
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const handleAddSnack = async (e) => {
    e.preventDefault();
    if (ean.length !== 13) {
      setEanMessage("O EAN deve ter exatamente 13 dígitos.");
      setEanMessageColor("text-red-600");
      return;
    }

    const newSnack = {
      name: snackName.toUpperCase(),
      ean,
      quantity,
      min_replenishment: minReplenishment,
    };

    const response = await fetch("http://localhost:3000/api/snacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSnack),
    });

    if (response.ok) {
      await fetchSnacks(); // Atualiza a lista após a adição
      setSnackName("");
      setEan("");
      setQuantity(0);
      setMinReplenishment(0);
      setEanMessage("");
    }
  };

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
      await fetchSnacks(); // Atualiza a lista após a alteração de estoque
      setStockChangeEan("");
      setChangeAmount(0);
    } else {
      alert("Falha ao atualizar o estoque. Tente novamente.");
    }
  };

  const handleChangeMinReplenishment = async (e) => {
    e.preventDefault();
    const snackToUpdate = snacks.find(
      (snack) => snack.ean === minReplenishmentEan
    );
    if (!snackToUpdate) {
      alert("Snack não encontrado!");
      return;
    }

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
      await fetchSnacks(); // Atualiza a lista após a alteração do mínimo de reposição
      setMinReplenishmentEan("");
      setNewMinReplenishment(0);
    } else {
      alert("Falha ao atualizar o mínimo de reposição. Tente novamente.");
    }
  };

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
      await fetchSnacks(); // Atualiza a lista após a baixa de estoque
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

  const handleRemoveSnack = async (id) => {
    await fetch(`http://localhost:3000/api/snacks/${id}`, {
      method: "DELETE",
    });
    await fetchSnacks(); // Atualiza a lista após a remoção
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredSnacks = snacks.filter(snack =>
    snack.name.toLowerCase().includes(searchTerm) || snack.ean.includes(searchTerm)
  );

  return (
   <div className="min-h-screen bg-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-extrabold text-gray-800">
        Bem-vindo ao Painel de Insumos
      </h1>
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
    >
      Sair
    </button>
  </div>


      {/* Formulário para adicionar um novo item */}
      <form onSubmit={handleAddSnack} className="mb-8 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Adicionar um novo item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nome do Insumo</label>
            <input
              type="text"
              placeholder="Nome do Insumo"
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
              placeholder="EAN"
              value={ean}
              onChange={handleEanChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            {eanMessage && (
              <p className={eanMessageColor}>{eanMessage}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Estoque</label>
            <input
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Mínimo de Reposição</label>
            <input
              type="number"
              placeholder="Mínimo de Reposição"
              value={minReplenishment}
              onChange={(e) => setMinReplenishment(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200">
          Adicionar Insumo
        </button>
      </form>

      {/* Formulário para alteração de estoque */}
      <form onSubmit={handleChangeStock} className="mt-8 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Adicionar ou Remover do Estoque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              placeholder="EAN"
              value={stockChangeEan}
              onChange={(e) => setStockChangeEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Quantidade a Alterar (+ ou -)</label>
            <input
              type="number"
              placeholder="Quantidade"
              value={changeAmount}
              onChange={(e) => setChangeAmount(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
          Alterar Estoque
        </button>
      </form>

      {/* Formulário para alteração do mínimo de reposição */}
      <form onSubmit={handleChangeMinReplenishment} className="mt-8 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Alterar Mínimo de Reposição</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              placeholder="EAN"
              value={minReplenishmentEan}
              onChange={(e) => setMinReplenishmentEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Novo Mínimo de Reposição</label>
            <input
              type="number"
              placeholder="Novo Mínimo"
              value={newMinReplenishment}
              onChange={(e) => setNewMinReplenishment(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-200">
          Alterar Mínimo de Reposição
        </button>
      </form>

      {/* Formulário para baixa de estoque
      <form onSubmit={handleWriteOffStock} className="mt-8 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Baixa de Estoque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">EAN do Insumo</label>
            <input
              type="text"
              placeholder="EAN"
              value={writeOffEan}
              onChange={(e) => setWriteOffEan(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Quantidade a Dar Baixa</label>
            <input
              type="number"
              placeholder="Quantidade"
              value={writeOffAmount}
              onChange={(e) => setWriteOffAmount(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200">
          Dar Baixa
        </button>
      </form> */}

      <h2 className="text-xl font-semibold mb-2 mt-8">Lista de Insumos</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por Nome ou EAN"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSnacks.map(snack => (
          <div
            key={snack.id}
            className={`p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-200 ${
              snack.quantity < snack.min_replenishment ? "bg-red-200" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold">{snack.name}</h3>
            <p><strong>EAN:</strong> {snack.ean}</p>
            <p><strong>Estoque:</strong> {snack.quantity}</p>
            <p><strong>Mínimo de Reposição:</strong> {snack.min_replenishment}</p>
            <button
              onClick={() => handleRemoveSnack(snack.id)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
