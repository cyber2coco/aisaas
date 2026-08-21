import sys

# 读取 bootstrap 文件
with open(sys.argv[1], 'rb') as f:
    content = f.read()

# 把 CRLF 转换成 LF
content = content.replace(b'\r\n', b'\n')

# 写回文件
with open(sys.argv[1], 'wb') as f:
    f.write(content)

print(f'Converted {sys.argv[1]} to LF line endings')
