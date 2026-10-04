// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            use tauri_plugin_shell::ShellExt;
            // Try to spawn the backend sidecar, but don't fail if it doesn't work
            match app.shell().sidecar("bin/backend") {
                Ok(sidecar_command) => {
                    match sidecar_command.spawn() {
                        Ok((_rx, _child)) => {
                            println!("Backend sidecar spawned successfully");
                            Ok(())
                        }
                        Err(e) => {
                            eprintln!("Failed to spawn backend sidecar: {}", e);
                            // Don't fail the app - continue without backend
                            Ok(())
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to get backend sidecar: {}", e);
                    // Don't fail the app - continue without backend
                    Ok(())
                }
            }
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
