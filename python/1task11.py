from collections import deque

def prufer_to_tree(prufer_code):

    n = len(prufer_code) + 2
    tree = [[] for _ in range(n)]  # Список смежности
    
    # 1. Вычисляем степени вершин
    degree = [1] * n
    for v in prufer_code:
        degree[v] += 1
    
    # 2. Находим все листья (вершины со степенью 1)
    leaves = deque()
    for v in range(n):
        if degree[v] == 1:
            leaves.append(v)
    
    # 3. Строим дерево
    for v in prufer_code:
        # Берем лист с минимальным номером
        leaf = leaves.popleft()
        
        # Добавляем ребро между листом и текущей вершиной
        tree[leaf].append(v)
        tree[v].append(leaf)
        
        # Уменьшаем степень и проверяем, стала ли вершина листом
        degree[v] -= 1
        if degree[v] == 1:
            leaves.append(v)
    
    # 4. Добавляем последнее ребро между оставшимися листьями
    u = leaves.popleft()
    v = leaves.popleft()
    tree[u].append(v)
    tree[v].append(u)
    
    return tree

def print_tree(tree):

    for i, neighbors in enumerate(tree):
        print(f"{i}: {sorted(neighbors)}")

def main():
    print("Алгоритм декодирования Прюфера")
    print("Введите код Прюфера (числа через пробел):")
    code = list(map(int, input().split()))
    
    # Декодирование
    tree = prufer_to_tree(code)
    
    print("\nРезультат декодирования:")
    print_tree(tree)

if __name__ == "__main__":
    main()