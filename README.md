# Densync AI Factory Analytics

A comprehensive factory analytics and AI-powered diagnostics platform built with Tauri, React, TypeScript, Rust, and Python FastAPI.

## Project Overview

Densync provides real-time factory monitoring, AI-powered diagnostics, knowledge management, and analytics for manufacturing operations across global plants.

## Team Roles

### 1. **Factory Operator** - PRIMARY USER
- Monitors factory equipment and processes through the Densync app
- Encounters errors and issues during daily operations
- Receives automatic solution suggestions when errors occur
- If error occurred before: Solution appears immediately
- If new error: Waits for expert to implement solution
- Does not need to search for errors - solutions appear in context
- Reports new issues to experts for resolution
- Applies verified solutions to fix equipment problems

### 2. **Factory Expert/Technician** - SOLUTION PROVIDER
- Receives reports of new errors from factory operators
- Analyzes and creates solutions for new issues
- Implements solutions into the knowledge base
- Verifies solutions work correctly before deployment
- Provides expert guidance for complex problems
- Updates solution database with working fixes
- Ensures solutions are specific to each factory location
- Monitors solution effectiveness and improves over time

### 3. **System Administrator** - PLATFORM MANAGER
- Manages Densync deployment across factory locations
- Ensures system availability and performance
- Configures factory-specific settings and permissions
- Monitors error patterns and solution effectiveness
- Coordinates between factory operators and experts
- Maintains user access and role assignments
- Handles system updates and maintenance
- Ensures data sync between factories and central system

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
