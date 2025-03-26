import random

def generate_random_function(num_vars):
    """Генерирует случайный вектор функции"""
    return [random.randint(0, 1) for _ in range(2 ** num_vars)]

def vector_to_cnf(function_vector, num_vars):
    """Преобразует вектор функции в КНФ (совершенную КНФ)"""
    cnf = []
    for i, value in enumerate(function_vector):
        if value == 0:
            clause = []
            for j in range(num_vars):
                var_val = (i >> (num_vars - 1 - j)) & 1
                clause.append((j, var_val))
            cnf.append(clause)
    return cnf

def cnf_to_string(cnf, num_vars):
    """Форматирует КНФ в читаемую строку"""
    if not cnf:
        return "1"  # Константа 1
    
    clause_strs = []
    for clause in cnf:
        lit_strs = []
        for var, val in clause:
            if val:
                lit_strs.append(f"x{var+1}")
            else:
                lit_strs.append(f"!x{var+1}")
        clause_strs.append("(" + " + ".join(lit_strs) + ")")
    
    return " * ".join(clause_strs) if clause_strs else "0"  # Константа 0

def evaluate_cnf(cnf, num_vars):
    """Вычисляет значения КНФ для всех входных комбинаций"""
    results = []
    for i in range(2 ** num_vars):
        input_values = [(i >> j) & 1 for j in range(num_vars)]
        result = True
        for clause in cnf:
            clause_val = False
            for var, val in clause:
                if input_values[var] == val:
                    clause_val = True
                    break
            result = result and clause_val
            if not result:
                break
        results.append(int(result))
    return results

def parse_cnf(cnf_str, num_vars):
    cnf = []
    # Удаляем все пробелы для упрощения парсинга
    cnf_str = cnf_str.replace(" ", "")
    
    # Разбиваем на дизъюнкты
    clauses = cnf_str.split('*')
    for clause in clauses:
        # Удаляем внешние скобки если есть
        clause = clause.strip()
        if clause.startswith('(') and clause.endswith(')'):
            clause = clause[1:-1]
        
        literals = []
        # Разбиваем на литералы
        for lit in clause.split('+'):
            lit = lit.strip()
            if not lit:
                continue
            neg = False
            if lit.startswith('!'):
                neg = True
                var = lit[1:]
            else:
                var = lit
            
            try:
                var_idx = int(var.replace('x', '')) - 1
                if var_idx < 0 or var_idx >= num_vars:
                    raise ValueError(f"Переменная {var} вне диапазона")
                literals.append((var_idx, not neg))  # Инвертируем для хранения
            except ValueError:
                raise ValueError(f"Некорректная переменная: {var}")
        cnf.append(literals)
    return cnf

def main():
    print("Игра: Проверка КНФ")
    print("Введите количество переменных (2-4 рекомендуется):")
    
    # Получаем количество переменных
    while True:
        try:
            num_vars = int(input())
            if 1 <= num_vars <= 5:
                break
            print("Ошибка: введите число от 1 до 5")
        except ValueError:
            print("Ошибка: введите целое число")
    
    # Генерируем случайную функцию
    function_vector = generate_random_function(num_vars)
    correct_cnf = vector_to_cnf(function_vector, num_vars)
    
    print(f"\nФункция от {num_vars} переменных (x1..x{num_vars})")
    print("Введите КНФ для этой функции. Примеры формата:")
    print("(x1 + !x2) * (!x1 + x3)  или  (x1 + x2) * (!x1 + !x2)")
    print("Можно без скобок: x1 + x2 * !x1 + !x2")
    print("Введите вашу КНФ:")
    
    # Получаем и проверяем КНФ
    while True:
        try:
            cnf_str = input().strip()
            if not cnf_str:
                print("Ошибка: ввод не может быть пустым")
                continue
                
            user_cnf = parse_cnf(cnf_str, num_vars)
            user_vector = evaluate_cnf(user_cnf, num_vars)
            
            if user_vector == function_vector:
                print("\nПравильно! Ваша КНФ верна.")
            else:
                print("\Неправильно! Ваша КНФ не соответствует функции.")
                print("\nПравильная КНФ:")
                print(cnf_to_string(correct_cnf, num_vars))
            break
            
        except ValueError as e:
            print(f"Ошибка: {e}. Попробуйте снова.")
        except Exception as e:
            print(f"Неизвестная ошибка: {e}. Попробуйте другой ввод.")

if __name__ == "__main__":
    main()