// productsController.test.js - VERSÃO SIMPLIFICADA QUE FUNCIONA

// O controller importa: require("../db") que aponta para src/db/index.js
jest.mock("../../../db/index.js", () => {
  return {
    query: jest.fn(),
    getConnection: jest.fn(),
    pool: {
      query: jest.fn(),
      getConnection: jest.fn(),
    },
  };
});

// 2. Importe o controller DEPOIS do mock
const { createProduct } = require("../../../controllers/productsControllers");

describe("createProduct - Testes Unitários", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Limpa todos os mocks
    jest.clearAllMocks();

    // Cria mocks de request e response
    mockReq = {
      body: {},
      file: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(), // Permite res.status().json()
      json: jest.fn(),
    };
  });

  // TESTE 1: Verificação básica
  test("deve importar a função createProduct", () => {
    expect(typeof createProduct).toBe("function");
  });

  // TESTE 2: Validação de campo obrigatório
  test("deve retornar erro 400 quando nome está vazio", async () => {
    mockReq.body = { name: "" };

    await createProduct(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'O campo "name" é obrigatório e não pode ser vazio.',
    });
  });

  // TESTE 3: Validação de campo ausente
  test("deve retornar erro 400 quando nome não é fornecido", async () => {
    mockReq.body = {};

    await createProduct(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'O campo "name" é obrigatório e não pode ser vazio.',
    });
  });

  // TESTE 4: Criação bem-sucedida com mock
  test("deve criar produto com sucesso (mock do banco)", async () => {
    // Configura dados de teste
    mockReq.body = {
      name: "Produto Teste",
      quantity: 10,
      price: 99.99,
    };

    // Obtém o mock do db
    const db = require("../../../db/index.js");

    // Configura o comportamento do mock
    db.query
      .mockResolvedValueOnce([{ insertId: 123 }]) // Primeira chamada: INSERT
      .mockResolvedValueOnce([
        [
          {
            // Segunda chamada: SELECT
            id: 123,
            name: "Produto Teste",
            quantity: 10,
            price: 99.99,
            img_url: null,
            barcode: null,
            category: null,
          },
        ],
      ]);

    // Executa a função
    await createProduct(mockReq, mockRes);

    // Verifica se o db.query foi chamado 2 vezes
    expect(db.query).toHaveBeenCalledTimes(2);

    // Verifica os parâmetros do INSERT
    expect(db.query.mock.calls[0][0]).toBe(
      "INSERT INTO products (name, barcode, category, quantity, price, img_url) VALUES (?, ?, ?, ?, ?, ?)"
    );

    // Verifica os parâmetros do SELECT
    expect(db.query.mock.calls[1][0]).toBe(
      "SELECT * FROM products WHERE id = ?"
    );
    expect(db.query.mock.calls[1][1]).toEqual([123]);

    // Verifica a resposta
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: 123,
        name: "Produto Teste",
      }),
    });
  });

  // TESTE 5: Erro no banco de dados
  test("deve retornar erro 500 quando banco falha", async () => {
    mockReq.body = { name: "Produto Teste" };

    const db = require("../../../db/index.js");
    const dbError = new Error("Erro de conexão com o banco");
    db.query.mockRejectedValue(dbError);

    // Mock do console.error para não poluir o output
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await createProduct(mockReq, mockRes);

    expect(consoleSpy).toHaveBeenCalledWith("Erro ao criar produto:", dbError);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Erro ao criar produto. Verifique os dados informados.",
    });

    consoleSpy.mockRestore();
  });
});
