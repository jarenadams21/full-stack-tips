import SwiftUI

struct PreviousValueExampleView: View {
    // Current text in the field
    @State private var inputValue: String = ""
    // Track what the previous text was (manually updated)
    @State private var previousValue: String = ""
    
    // In SwiftUI, we use a focus binding to imperatively focus elements
    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Swift-like Example for Previous Value & Focus")
                .font(.headline)

            // TextField with focus binding
            TextField("Type something...", text: $inputValue)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .focused($isFocused)

            // Button that toggles focus
            Button("Focus the TextField") {
                // This is similar to calling inputRef.current?.focus() in React
                isFocused = true
            }

            // Display the old and new values
            Text("Current Value: \(inputValue)")
            Text("Previous Value: \(previousValue.isEmpty ? "(none yet)" : previousValue)")

        }
        .padding()
        .onChange(of: inputValue) { newValue in
            // Each time inputValue changes, store the OLD value in previousValue
            // So effectively, we shift inputValue -> previousValue
            // If you specifically want the "previous" from the last time it changed,
            // you can store the old value in a temp var here. For simplicity:
            previousValue = newValue
        }
    }
}

struct PreviousValueExampleView_Previews: PreviewProvider {
    static var previews: some View {
        PreviousValueExampleView()
    }
}
