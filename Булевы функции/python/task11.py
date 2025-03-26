import random
from itertools import product, combinations

def main():
    print("Проверка полноты системы булевых функций")
    
    num_functions = int(input("Введите количество функций в системе: "))
    num_variables = int(input("Введите количество аргументов у функций: "))
    
    variables = [f'x{i+1}' for i in range(num_variables)]
    functions = []
    
    print("\nСгенерированные функции (векторы):")
    for i in range(num_functions):
        vector = [random.randint(0, 1) for _ in range(2 ** num_variables)]
        
        print(f"Функция {i+1}: {' '.join(map(str, vector))}")
        
        def func(inputs, vec=vector, vars=variables):
            index = 0
            for j, var in enumerate(vars):
                index += inputs[var] * (2 ** (len(vars) - j - 1))
            return vec[index]
        
        functions.append(func)
    
    print("\nОпределите, является ли система полной:")
    user_complete = input("Введите 'да' или 'нет': ").strip().lower()

    closed_classes = []
    if user_complete == 'нет':
        print("\nВыберите замкнутые классы, которым принадлежит система (через запятую):")
        print("Доступные классы: T0, T1, S, M, L")
        user_classes = input("Ваш выбор: ").strip().upper().split(',')
        closed_classes = [c.strip() for c in user_classes]

    is_correct, true_complete, true_classes = check_user_answer(functions, variables, user_complete == 'да', closed_classes)

    print("\nРезультат проверки:")
    if is_correct:
        print("Ваш ответ правильный!")
    else:
        print("Ваш ответ неправильный.")
        if true_complete:
            print("На самом деле система является полной.")
        else:
            print(f"На самом деле система принадлежит классам: {', '.join(true_classes)}")

def check_user_answer(functions, variables, user_complete, user_classes):
    """Проверяет, правильно ли пользователь определил полноту системы."""
    # Определяем истинную полноту системы
    true_complete, true_classes = is_complete_system(functions, variables)
    
    # Проверяем ответ пользователя
    if user_complete == true_complete:
        if not true_complete:
            # Проверяем, правильно ли выбраны классы
            user_classes_set = set(user_classes)
            true_classes_set = {c.split()[0] for c in true_classes} if true_classes else set()
            if user_classes_set == true_classes_set:
                return True, true_complete, true_classes
            else:
                return False, true_complete, true_classes
        else:
            return True, true_complete, true_classes
    else:
        return False, true_complete, true_classes

def is_complete_system(functions, variables):
    """Проверяет полноту системы булевых функций."""
    # Проверяем принадлежность к каждому из пяти замкнутых классов
    classes = {
        'T0 (сохраняет ноль)': all(check_preserves_zero(func, variables) for func in functions),
        'T1 (сохраняет единицу)': all(check_preserves_one(func, variables) for func in functions),
        'S (самодвойственные)': all(check_self_dual(func, variables) for func in functions),
        'M (монотонные)': all(check_monotonic(func, variables) for func in functions),
        'L (линейные)': all(check_linear(func, variables) for func in functions)
    }
    
    # Система полна, если не содержится ни в одном из классов
    is_complete = not any(classes.values())
    closed_classes = [name.split()[0] for name, belongs in classes.items() if belongs]
    
    return is_complete, closed_classes

def check_preserves_zero(func, variables):
    """Проверяет, сохраняет ли функция ноль (f(0, ..., 0) = 0)."""
    input_values = {var: 0 for var in variables}
    return func(input_values) == 0

def check_preserves_one(func, variables):
    """Проверяет, сохраняет ли функцию единицу (f(1, ..., 1) = 1)."""
    input_values = {var: 1 for var in variables}
    return func(input_values) == 1

def check_self_dual(func, variables):
    """Проверяет, является ли функция самодвойственной."""
    for assignment in generate_all_assignments(variables):
        dual_assignment = {var: 1 - val for var, val in assignment.items()}
        if func(assignment) == func(dual_assignment):
            return False
    return True

def check_monotonic(func, variables):
    """Проверяет, является ли функция монотонной."""
    assignments = list(generate_all_assignments(variables))
    n = len(assignments)
    for i in range(n):
        for j in range(i + 1, n):
            a1 = assignments[i]
            a2 = assignments[j]
            if all(a1[var] <= a2[var] for var in variables):
                if func(a1) > func(a2):
                    return False
    return True

def check_linear(func, variables):
    """Проверяет, является ли функция линейной через полином Жегалкина."""
    # Получаем вектор значений функции
    vector = []
    for assignment in generate_all_assignments(variables):
        vector.append(func(assignment))
    
    # Строим полином Жегалкинаа
    n = len(vector)
    triangle = [vector.copy()]
    for i in range(1, n):
        row = []
        for j in range(n - i):
            row.append(triangle[i-1][j] ^ triangle[i-1][j+1])
        triangle.append(row)
    
    coefficients = [row[0] for row in triangle]
    
    if len(variables) <= 1:
        return True  # Функции от 0 или 1 переменной всегда линейны
    
    # Генерируем все возможные комбинации из 2+ переменных
    nonlinear_terms = []
    for k in range(2, len(variables)+1):
        nonlinear_terms.extend(combinations(range(len(variables)), k))
    
    # Проверяем соответствующие коэффициенты
    for term in nonlinear_terms:
        # Индекс в полиноме Жегалкина для данного набора переменных
        index = sum(2**i for i in term)
        if coefficients[index]:
            return False
    
    return True

def generate_all_assignments(variables):
    """Генерирует все возможные наборы значений переменных."""
    for values in product([0, 1], repeat=len(variables)):
        yield dict(zip(variables, values))

if __name__ == "__main__":
    main()