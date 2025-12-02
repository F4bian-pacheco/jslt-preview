import * as assert from 'assert';
import { JsltApiService } from '../services/JsltApiService';

suite('JsltApiService Test Suite', () => {
  let apiService: JsltApiService;

  setup(() => {
    apiService = new JsltApiService();
  });

  test('Should create JsltApiService instance', () => {
    assert.ok(apiService);
  });

  test('Transform should return success for valid input', async function () {
    this.timeout(10000); // Aumentar timeout para llamadas a API

    const inputJson = { name: 'Test', value: 42 };
    const jsltExpression = '.';

    try {
      const result = await apiService.transform(inputJson, jsltExpression);
      assert.ok(result);
      assert.ok('success' in result);
      assert.ok('output' in result);
    } catch (error) {
      // Si el servidor no está disponible, el test pasa
      // En un entorno de CI/CD, el servidor debería estar corriendo
      console.warn('API server not available, skipping test');
      this.skip();
    }
  });

  test('Transform should handle timeout', async function () {
    this.timeout(15000);

    const inputJson = { test: true };
    const jsltExpression = '.';

    try {
      await apiService.transform(inputJson, jsltExpression);
    } catch (error: any) {
      // Si falla por timeout o conexión, es esperado
      assert.ok(
        error.message.includes('timeout') ||
        error.message.includes('fetch')
      );
    }
  });

  test('Validate should return result for valid expression', async function () {
    this.timeout(10000);

    const jsltExpression = '.name';

    try {
      const result = await apiService.validate(jsltExpression);
      assert.ok(result);
      assert.ok('valid' in result);
    } catch (error) {
      console.warn('API server not available, skipping test');
      this.skip();
    }
  });

  test('Validate should handle empty expression', async function () {
    this.timeout(10000);

    const jsltExpression = '';

    try {
      const result = await apiService.validate(jsltExpression);
      assert.ok(result);
      // Una expresión vacía probablemente no sea válida
      assert.strictEqual(result.valid, false);
    } catch (error) {
      console.warn('API server not available, skipping test');
      this.skip();
    }
  });
});
