// 1. Mock APENAS do que é usado
jest.mock("../../../db/index.js", () => ({
  query: jest.fn(),
}));

// 2. Importe DEPOIS do mock
const { createProduct } = require("../../../controllers/productsControllers");

describe("createProduct - Testes Unitários COMPLETOS", () => {
  let mockReq, mockRes, db;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      file: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Obtém o mock atualizado
    db = require("../../../db/index.js");
  });

  // ========== TESTES DE VALIDAÇÃO ==========

  describe("Validação do compo name", () => {
    test.each([
      { cenario: "vazio", valor: "" },
      { cenario: "null", valor: null },
      { cenario: "não fornecido", valor: undefined },
    ])("deve retornar erro 400 quando nome é $cenario", async ({ valor }) => {
      //Arrange
      mockReq.body = { name: valor };

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining("name"),
        })
      );
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe("Validação do campo quantity", () => {
    test.each([
      { cenario: "negativo", valor: -5 },
      { cenario: "string (NAN)", valor: "não é número" },
      { cenario: "booleano", valor: true },
      { cenario: "NaN", valor: NaN },
    ])(
      "deve retornar erro 400 quando quantity é $cenario",
      async ({ valor }) => {
        // Arrange
        mockReq.body = { name: "Produto", quantity: valor };

        // Act
        await createProduct(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            error: expect.stringContaining("Quantidade"),
          })
        );
        expect(db.query).not.toHaveBeenCalled();
      }
    );
  });

  describe("Validação do campo price", () => {
    test.each([
      { descricao: "negativo", valor: -10.5 },
      { descricao: "null", valor: null },
      { descricao: "undefined", valor: undefined },
      { descricao: "NaN", valor: NaN },
    ])(
      "deve retornar erro 400 quando price é $descricao",
      async ({ valor }) => {
        // Arrange
        mockReq.body = { name: "Produto", price: valor };

        //Act
        await createProduct(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            error: expect.stringContaining("Preço"),
          })
        );
        expect(db.query).not.toHaveBeenCalled();
      }
    );
  });

  // ========== TESTES DE SUCESSO ==========

  describe("Sucesso na criação de produtos", () => {
    test("deve criar produto com valores padrão corretos", async () => {
      // Arrange
      mockReq.body = { name: "Produto Teste" };

      db.query
        .mockResolvedValueOnce([{ insertId: 1 }]) // INSERT
        .mockResolvedValueOnce([
          [
            {
              id: 1,
              name: "Produto Teste",
              quantity: 0,
              price: 0,
              img_url: null,
            },
          ],
        ]); // SELECT

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(2);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO products"),
        ["Produto Teste", undefined, undefined, 0, 0, null]
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Produto criado com sucesso!",
          data: expect.objectContaining({
            id: 1,
            name: "Produto Teste",
            quantity: 0,
            price: 0,
          }),
        })
      );
    });

    test("deve criar produto com imagem quando file existe", async () => {
      // Arrange
      mockReq.body = { name: "Produto Com Imagem" };
      mockReq.file = { filename: "imagem.jpg" };

      db.query.mockResolvedValueOnce([{ insertId: 2 }]).mockResolvedValueOnce([
        [
          {
            id: 2,
            name: "Produto Com Imagem",
            img_url: "/uploads/imagem.jpg",
          },
        ],
      ]);

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(2);

      const queryValues = db.query.mock.calls[0][1];
      expect(queryValues).toContain("/uploads/imagem.jpg");

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test("deve criar produto com todos os campos preenchidos", async () => {
      // Arrange
      const fullProduct = {
        name: "Produto Completo",
        barcode: "123456789",
        category: "Eletrônicos",
        quantity: 50,
        price: 299.99,
      };
      mockReq.body = fullProduct;

      db.query
        .mockResolvedValueOnce([{ insertId: 3 }])
        .mockResolvedValueOnce([[{ id: 3, ...fullProduct, img_url: null }]]);

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(2);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [
        "Produto Completo",
        "123456789",
        "Eletrônicos",
        50,
        299.99,
        null,
      ]);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test("deve permitir quantity zero e price zero (valores válidos)", async () => {
      // Arrange
      mockReq.body = { name: "Produto Gratuito", quantity: 0, price: 0 };

      db.query
        .mockResolvedValueOnce([{ insertId: 4 }])
        .mockResolvedValueOnce([
          [{ id: 4, name: "Produto Gratuito", quantity: 0, price: 0 }],
        ]);

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([0, 0])
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            quantity: 0,
            price: 0,
          }),
        })
      );
    });
  });

  // ========== TESTES DE FALHA / ERROS ==========
  describe("Tratamento de erros e casos de borda", () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("deve retornar erro 500 quando banco falha no INSERT", async () => {
      // Arrange
      mockReq.body = { name: "Produto Teste" };
      const dbError = new Error("Falha na conexão");

      db.query.mockRejectedValueOnce(dbError);

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erro ao criar produto:",
        dbError
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
        })
      );

      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test("deve retornar erro 500 quando SELECT falha após INSERT", async () => {
      // Arrange
      mockReq.body = { name: "Produto Teste" };

      db.query
        .mockResolvedValueOnce([{ insertId: 10 }]) // INSERT OK
        .mockRejectedValueOnce(new Error("Falha no SELECT")); // SELECT falha

      // Act
      await createProduct(mockReq, mockRes);

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
        })
      );

      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });
});
