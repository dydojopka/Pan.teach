# НА ВСЯКИЙ СЛУЧАЙ ПРОВЕРЬТЕ ПРАВИЛНОСТЬ ОТВЕТОВ

def analyze_variables(function_vector):
    n = len(function_vector)
    if n == 0:
        return [], []
    
    # Определяем количество переменных
    num_vars = 0
    while (1 << num_vars) < n:
        num_vars += 1
    
    if (1 << num_vars) != n:
        raise ValueError("Длина вектора функции должна быть степенью двойки")
    
    essential_vars = []
    fictitious_vars = []
    
    for var in range(num_vars):
        is_fictitious = True
        # Создаем маски для сравнения значений функции
        step = 1 << var
        for i in range(0, n, step << 1):
            for j in range(step):
                if function_vector[i + j] != function_vector[i + j + step]:
                    is_fictitious = False
                    break
            if not is_fictitious:
                break
        
        if is_fictitious:
            fictitious_vars.append(var)
        else:
            essential_vars.append(var)
    
    return essential_vars, fictitious_vars

def main():
    print("Игра: Определение существенных и фиктивных переменных")
    print("Введите вектор функции в виде последовательности 0 и 1 (например, 0001):")
    
    while True:
        input_str = input().strip()
        if all(c in '01' for c in input_str):
            break
        print("Ошибка: введите только 0 и 1")
    
    function_vector = [int(c) for c in input_str]
    
    try:
        essential, fictitious = analyze_variables(function_vector)
        
        print("\nРезультат анализа:")
        print(f"Вектор функции: {input_str}")
        print(f"Существенные переменные: {essential}")
        print(f"Фиктивные переменные: {fictitious}")
        
            
    except ValueError as e:
        print(f"Ошибка: {e}")

if __name__ == "__main__":
    main()