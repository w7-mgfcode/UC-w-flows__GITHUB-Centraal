# Coding Standards by Language

## Python

### Structure
- Use type hints: `def function_name(param: str) -> bool:`
- Docstring format (Google style):
  ```python
  def my_function(param: str) -> bool:
      """Brief description.
      
      Longer description if needed.
      
      Args:
          param: Description of parameter
          
      Returns:
          Description of return value
          
      Raises:
          ValueError: When something goes wrong
      """
  ```
- Max line length: 100 characters
- Use f-strings: `f"Hello {name}"`

### Testing
```python
import pytest

def test_my_function():
    """Test description."""
    result = my_function("test")
    assert result == True
    
def test_my_function_error():
    """Test error handling."""
    with pytest.raises(ValueError):
        my_function("")
```

## JavaScript / TypeScript

### Structure
- Use const/let, never var
- Type hints in TypeScript: `function name(param: string): boolean {}`
- JSDoc format:
  ```javascript
  /**
   * Brief description.
   * @param {string} param - Parameter description
   * @returns {boolean} Return description
   * @throws {Error} When something goes wrong
   */
  function myFunction(param) {
    // implementation
  }
  ```
- Use arrow functions: `const fn = (x) => x * 2`
- Async/await for promises: `const data = await fetchData()`

### Testing
```javascript
describe('myFunction', () => {
  test('should return true for valid input', () => {
    expect(myFunction('test')).toBe(true);
  });
  
  test('should throw error for empty input', () => {
    expect(() => myFunction('')).toThrow();
  });
});
```
