import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
        },
        rules: {
            // Quy tắc cơ bản từ ESLint
            ...js.configs.recommended.rules,

            // Quy tắc đề xuất từ React
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,

            // Quy tắc đề xuất từ React Hooks
            ...reactHooks.configs.recommended.rules,

            // Tối ưu hóa cho dự án React
            'react/react-in-jsx-scope': 'off', // Không cần import React từ React 17+
            'react/jsx-no-target-blank': 'off', // Tắt yêu cầu thêm rel="noopener noreferrer" khi dùng target="_blank"
            'react/display-name': 'off', // Không cần display-name cho các component
            'react/prop-types': 'off', // Tắt prop-types nếu không sử dụng
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ], // Cảnh báo nếu không chỉ export component trong React Refresh

            // Quy tắc cho React Hooks
            'react-hooks/rules-of-hooks': 'error', // Báo lỗi nếu không tuân thủ quy tắc React Hooks
            'react-hooks/exhaustive-deps': 'warn', // Cảnh báo khi thiếu dependencies trong useEffect

            // Quy tắc JavaScript chung
            'no-console': 'warn', // Cảnh báo khi dùng console.log
            'no-debugger': 'error', // Báo lỗi khi sử dụng debugger
            'no-unused-vars': 'warn', // Cảnh báo khi có biến không sử dụng
            'no-trailing-spaces': 'warn', // Cảnh báo khi có dấu cách ở cuối dòng
            'no-multi-spaces': 'warn', // Cảnh báo khi có nhiều dấu cách liên tiếp
            'no-multiple-empty-lines': 'warn', // Cảnh báo khi có nhiều dòng trống liên tiếp
            'space-before-blocks': ['error', 'always'], // Báo lỗi khi không có dấu cách trước dấu ngoặc nhọn mở
            'object-curly-spacing': ['warn', 'always'], // Cảnh báo nếu không có dấu cách bên trong dấu ngoặc nhọn của object
            indent: ['warn', 4], // Cảnh báo nếu không tuân thủ thụt lề 4 khoảng trắng
            semi: ['warn', 'never'], // Cảnh báo nếu sử dụng dấu chấm phẩy (semi-colon)
            quotes: ['error', 'single'], // Báo lỗi nếu không dùng dấu nháy đơn trong chuỗi
            'array-bracket-spacing': 'warn', // Cảnh báo khi không có dấu cách bên trong dấu ngoặc vuông của array
            'linebreak-style': 'off', // Tắt kiểm tra kiểu xuống dòng (phù hợp với mọi hệ điều hành)
            'no-unexpected-multiline': 'warn', // Cảnh báo khi có dấu xuống dòng không mong muốn
            'keyword-spacing': 'warn', // Cảnh báo khi không có dấu cách giữa từ khóa và dấu ngoặc
            // 'comma-dangle': 'warn', // Kiểm tra dấu phẩy cuối dòng
            'comma-spacing': 'warn', // Cảnh báo khi không có dấu cách sau dấu phẩy
            'arrow-spacing': 'warn', // Cảnh báo khi không có dấu cách giữa mũi tên (=>) trong arrow function

            // Quy tắc bổ sung cho code dễ đọc hơn
            'no-lonely-if': 'warn', // Cảnh báo khi có if đơn độc không nằm trong else
        },
    },
]
