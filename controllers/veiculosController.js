import { Veiculos } from "../models/veiculo.js";

// Lista os veículos do usuário logado
export const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await Veiculos.findAll({ where: { id_usuario: req.usuarioId } });
    res.json(veiculos);
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao listar veículos" });
  }
};

// Cadastra um novo veículo
export const cadastrarVeiculo = async (req, res) => {
  try {
    const { placa, modelo, cor, tipo_veiculo } = req.body;

    const veiculoExistente = await Veiculos.findOne({ where: { placa } });
    if (veiculoExistente) {
      return res.status(400).json({ mensagem: "Já existe um veículo com essa placa." });
    }

    const novoVeiculo = await Veiculos.create({
      placa,
      modelo,
      cor,
      tipo_veiculo,
      id_usuario: req.usuarioId,
    });

    res.status(201).json(novoVeiculo);
  } catch (erro) {
    console.error("Erro ao criar veículo:", erro);
    res.status(500).json({ mensagem: "Erro ao criar veículo" });
  }
};

// Atualiza os dados de um veículo
export const atualizarVeiculo = async (req, res) => {
  const { id_veiculo } = req.body;

  try {
    if (!id_veiculo) {
      return res.status(400).json({ mensagem: "ID do veículo é obrigatório." });
    }

    const veiculo = await Veiculos.findOne({
      where: { id_veiculo, id_usuario: req.usuarioId }
    });

    if (!veiculo) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado' });
    }

    const dadosParaAtualizar = { ...req.body };
    delete dadosParaAtualizar.id_veiculo;

    const [_, [veiculoAtualizado]] = await Veiculos.update(dadosParaAtualizar, {
      where: { id_veiculo, id_usuario: req.usuarioId },
      returning: true
    });

    res.json(veiculoAtualizado);
  } catch (erro) {
    console.error("Erro ao atualizar veículo:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar veículo" });
  }
};

// Remove um veículo
export const removerVeiculo = async (req, res) => {
  const { id_veiculo } = req.body;

  if (!id_veiculo) {
    return res.status(400).json({ mensagem: 'ID do veículo é obrigatório.' });
  }

  try {
    const veiculo = await Veiculos.findOne({
      where: { id_veiculo, id_usuario: req.usuarioId }
    });

    if (!veiculo) {
      return res.status(404).json({ mensagem: 'Veículo não encontrado.' });
    }

    await Veiculos.destroy({
      where: { id_veiculo, id_usuario: req.usuarioId }
    });

    res.status(200).json({ mensagem: 'Veículo removido com sucesso.' });
  } catch (erro) {
    console.error("Erro ao remover veículo:", erro);
    res.status(500).json({ mensagem: 'Erro ao remover veículo.' });
  }
};