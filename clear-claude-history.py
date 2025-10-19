#!/usr/bin/env python3
"""
Claude History Cleaner

This script clears the history array from the Claude JSON configuration file
to prevent file bloat from accumulating conversation history.
"""

import json
import os
import sys
from pathlib import Path

def clear_claude_history():
    """Clear the history array from Claude's JSON configuration file."""

    # Try specific locations for claude.json
    possible_paths = [
        "/home/nwender/.claude.json",
        "C:\\Users\\Anwender\\.claude.json"
    ]

    claude_file = None
    for path in possible_paths:
        if os.path.exists(path):
            claude_file = path
            break

    if not claude_file:
        print("❌ Claude configuration file not found in any of the expected locations:")
        for path in possible_paths:
            print(f"   - {path}")
        sys.exit(1)

    print(f"📁 Found Claude configuration file: {claude_file}")

    # Create backup
    backup_file = f"{claude_file}.backup"
    try:
        with open(claude_file, 'r', encoding='utf-8') as f:
            data = f.read()
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.write(data)
        print(f"✅ Created backup: {backup_file}")
    except Exception as e:
        print(f"❌ Failed to create backup: {e}")
        sys.exit(1)

    # Load and process JSON
    try:
        with open(claude_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in Claude config: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to read Claude config: {e}")
        sys.exit(1)

    # Check if history exists and clear it
    original_size = len(json.dumps(config))

    if "history" in config:
        history_count = len(config["history"])
        config["history"] = []

        # Write cleaned config back
        try:
            with open(claude_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)

            new_size = len(json.dumps(config))
            saved_bytes = original_size - new_size
            saved_mb = saved_bytes / (1024 * 1024)

            print(f"✅ Cleared {history_count} history entries")
            print(f"📊 Reduced file size by {saved_bytes:,} bytes ({saved_mb:.2f} MB)")
            print(f"💾 Updated configuration saved")

        except Exception as e:
            print(f"❌ Failed to write cleaned config: {e}")
            print(f"🔄 Restoring from backup...")
            os.replace(backup_file, claude_file)
            sys.exit(1)
    else:
        print("ℹ️  No history field found in Claude configuration")

    # Clean up backup if successful
    try:
        os.remove(backup_file)
        print(f"🗑️  Removed backup file")
    except:
        print(f"⚠️  Could not remove backup file: {backup_file}")

def main():
    """Main function."""
    print("🧹 Claude History Cleaner")
    print("=" * 30)

    try:
        clear_claude_history()
        print("\n✅ Claude history cleanup completed successfully!")
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()