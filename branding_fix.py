import os

def cleanup(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update Logo references
        content = content.replace('src="/HAPPYYTALK.png"', 'src="/logo.png"')
        content = content.replace('src="/happyytalk.png"', 'src="/logo.png"')
        content = content.replace('src="/happytalk.png"', 'src="/logo.png"')
        
        # 2. Add space to branding
        content = content.replace('HAPPYYTALK', 'HAPPYY TALK')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        print(f"Error: {e}")

def main():
    dirs = [
        '/Users/afi/Downloads/HT-.git/social-network/src',
        '/Users/afi/Downloads/HT-.git/social-network/public'
    ]
    for d in dirs:
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(('.js', '.jsx', '.css', '.html', '.json', '.md')):
                    cleanup(os.path.join(root, file))

if __name__ == "__main__":
    main()
