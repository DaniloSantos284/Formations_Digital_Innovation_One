const db = require("../db");

async function createProduct(req, res) {
  try {
    const { name, barcode, category, quantity = 0, price = 0 } = req.body;

    // VALIDAÇÃO: Garantir que 'name' não é vazio ou nulo (campo obrigatório)
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: 'O campo "name" é obrigatório e não pode ser vazio.'
      })
    }

    // VALIDAÇÃO: Garantir que quantity é um número não-negativo
    if (quantity === null || isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: "Quantidade deve ser um número maior ou igual a zero"
      });
    }

    // VALIDAÇÃO: Garantir que price é um número não-negativo
    if ((price === null && price !== undefined) || isNaN(price) || price < 0) {
      return res.status(400).json({ 
        success: false,
        error: "Preço deve ser um número válido" 
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      'INSERT INTO products (name, barcode, category, quantity, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, barcode, category, quantity, price, image]
    );

    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("Erro ao criar produto:", err);

    return res.status(500).json({
      error: "Erro ao criar produto. Verifique os dados informados.",
    });
  }
}

async function listProducts(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: rows
    });
    
  } catch (err) {
    console.error("Erro ao listar produtos:", err);

    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "ID inválido"
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado"
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error("Erro ao buscar produto por ID:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  }
}

async function addStock(req, res) {
  const { id } = req.params;
  const { amount } = req.body;

  let connection;

  try {
    const amountNumber = Number(amount);

    // VALIDAÇÃO: amount deve ser um número positivo
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({
        error: 'Campo "amount" deve ser um número positivo',
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // Atualiza a quantidade do produto
    const [updateResult] = await connection.query(
      "UPDATE products SET quantity = quantity + ? WHERE id = ?",
      [amountNumber, id]
    );

    // Se não encontrou o produto
    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Registro de movimentação
    await connection.query(
      "INSERT INTO movements (product_id, type, amount) VALUES (?, ?, ?)",
      [id, "in", amountNumber]
    );

    await connection.commit();

    res.json({ 
      success: true,
      message: "Estoque adicionado com sucesso"
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Erro ao adicionar estoque:", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Erro ao adicionar estoque. Verifique se o produto existe.",
      });
  } finally {
    if (connection) connection.release();
  }
}

async function removeStock(req, res) {
  const { id } = req.params;
  const { amount } = req.body;

  let connection;

  try {
    const amountNumber = Number(amount);
    
    // VALIDAÇÃO
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({
        error: 'Campo "Quantia" deve ser um número positivo',
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1) Buscar produto para checar quantidade
    const [products] = await connection.query(
      'SELECT quantity FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'produto não encontrado' })
    }

    const currentQuantity = products[0].quantity;

    // 2) Verificar se há estoque disponível
    if (currentQuantity < amountNumber) {
      await connection.rollback();
      return res.status(400).json({
        error: `Estoque insuficiente. Atual: ${currentQuantity}, solicitado: ${amountNumber}`,
      });
    }

    // 3) Atualizar estoque 
    await connection.query(
      'UPDATE products SET quantity = quantity - ?, updated_at = NOW() WHERE id = ?',
      [amountNumber, id]
    );

    // 4) Registrar movimento
    await connection.query(
      'INSERT INTO movements (product_id, type, amount) VALUES (?, ?, ?)',
      [id, 'out', amountNumber]
    );

    await connection.commit();

    res.json({ 
      success: true,
      message: 'Estoque removido com sucesso'
    });
} catch (err) {
  if (connection) await connection.rollback();
  console.error('Erro ao remover estoque:', err);
  res.status(500).json({
    success: false,
    error: 'Erro ao remover estoque. Verifique se o produto existe e tem quantidade suficiente.',
  }); 
} finally {
  if (connection) connection.release();
}}

async function getHistory(req, res) {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "ID inválido"
    });
  }

  try {
    const [products] = await db.query(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado"
      });
    }

    const [rows] = await db.query(
      'SELECT * FROM movements WHERE product_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("Erro ao buscar histórico de movimentações:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  } 
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  addStock,
  removeStock,
  getHistory,
};
