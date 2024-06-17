#!/bin/bash

# Percorrer todos os arquivos .jsx e .tsx no diretório atual e subdiretórios
find . -type f \( -name "*.jsx" -o -name "*.tsx" \) | while read -r file; do
    # Verificar se o arquivo contém o componente ClayButton
    if grep -q "<ClayButton" "$file"; then
        # Verificar se o ClayButton já possui um aria-label
        if ! grep -q "<ClayButton[^>]*aria-label=" "$file"; then
            # Adicionar aria-label='to do' ao ClayButton
            sed -i.bak -E 's/(<ClayButton[^>]*)>/\1 aria-label="to do">/' "$file"
            echo "aria-label adicionado no arquivo: $file"
        fi
    fi
done

echo "Processo concluído."
