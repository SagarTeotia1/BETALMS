import tkinter as tk
from tkinter import colorchooser, filedialog, messagebox
from PIL import ImageGrab

class DrawingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Advanced Drawing App")
        self.root.geometry("1000x700")
        self.root.configure(bg="#f0f0f0")

        self.brush_color = "black"
        self.brush_size = 5
        self.eraser_on = False

        self.setup_ui()
        self.bind_events()

    def setup_ui(self):
        # Toolbar frame
        tool_frame = tk.Frame(self.root, bg="#dddddd")
        tool_frame.pack(side=tk.TOP, fill=tk.X)

        # Pick color
        color_btn = tk.Button(tool_frame, text="Pick Color 🎨", command=self.choose_color)
        color_btn.pack(side=tk.LEFT, padx=10, pady=10)

        # Eraser
        self.eraser_btn = tk.Button(tool_frame, text="Eraser 🧽", command=self.toggle_eraser)
        self.eraser_btn.pack(side=tk.LEFT, padx=10)

        # Brush size
        tk.Label(tool_frame, text="Brush Size:").pack(side=tk.LEFT, padx=(20, 0))
        self.size_slider = tk.Scale(tool_frame, from_=1, to=50, orient=tk.HORIZONTAL)
        self.size_slider.set(self.brush_size)
        self.size_slider.pack(side=tk.LEFT)

        # Clear
        clear_btn = tk.Button(tool_frame, text="Clear 🗑️", command=self.clear_canvas)
        clear_btn.pack(side=tk.LEFT, padx=20)

        # Save
        save_btn = tk.Button(tool_frame, text="Save 💾", command=self.save_canvas)
        save_btn.pack(side=tk.LEFT)

        # Canvas area
        self.canvas = tk.Canvas(self.root, bg="white", width=960, height=600)
        self.canvas.pack(pady=10)

    def bind_events(self):
        self.canvas.bind("<ButtonPress-1>", self.start_draw)
        self.canvas.bind("<B1-Motion>", self.draw)

    def choose_color(self):
        color = colorchooser.askcolor(title="Choose Brush Color")
        if color[1]:
            self.brush_color = color[1]
            self.eraser_on = False
            self.eraser_btn.config(relief=tk.RAISED)

    def toggle_eraser(self):
        self.eraser_on = not self.eraser_on
        if self.eraser_on:
            self.eraser_btn.config(relief=tk.SUNKEN)
        else:
            self.eraser_btn.config(relief=tk.RAISED)

    def start_draw(self, event):
        self.last_x = event.x
        self.last_y = event.y

    def draw(self, event):
        color = "white" if self.eraser_on else self.brush_color
        size = self.size_slider.get()

        self.canvas.create_line(self.last_x, self.last_y, event.x, event.y,
                                fill=color, width=size, capstyle=tk.ROUND, smooth=True)
        self.last_x = event.x
        self.last_y = event.y

    def clear_canvas(self):
        self.canvas.delete("all")

    def save_canvas(self):
        try:
            self.root.update()
            x = self.root.winfo_rootx() + self.canvas.winfo_x()
            y = self.root.winfo_rooty() + self.canvas.winfo_y()
            x1 = x + self.canvas.winfo_width()
            y1 = y + self.canvas.winfo_height()

            image = ImageGrab.grab().crop((x, y, x1, y1))
            filepath = filedialog.asksaveasfilename(
                defaultextension=".png",
                filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
            )
            if filepath:
                image.save(filepath)
                messagebox.showinfo("Saved", f"Drawing saved to:\n{filepath}")
        except Exception as e:
            messagebox.showerror("Error", f"Could not save image:\n{e}")

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = DrawingApp(root)
    root.mainloop()
