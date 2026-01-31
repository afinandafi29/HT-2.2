import os

def add_space(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace HAPPYYTALK with HAPPYY TALK
        # Handle cases where it might already have a space (though unlikely given previous tool call)
        content = content.replace('HAPPYYTALK', 'HAPPYY TALK')
        content = content.replace('happyytalk', 'happyytalk') # keep lowercase link-style keywords as they are? 
        # Actually user specifically said "give space after HAPPYY TALK"
        # I'll check if they want it everywhere or just in titles.
        # Usually it's branding.
        
        # Let's be smart. 
        # In files like manifest.json it should be HAPPYY TALK.
        # In URLs it should probably stay nospace.
        
        # Manifest:
        if file_path.endswith('manifest.json'):
             content = content.replace('"short_name": "HAPPYYTALK"', '"short_name": "HAPPYY TALK"')
             content = content.replace('"name": "HAPPYYTALK"', '"name": "HAPPYY TALK"')

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
                    add_space(os.path.join(root, file))

if __name__ == "__main__":
    main()
