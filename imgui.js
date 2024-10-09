
function addScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function loadScripts() {
    try {
        await Promise.all([
            addScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js'),
            addScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/75/three.min.js'),
            addScript('https://flyover.github.io/imgui-js/dist/imgui.umd.js'),
            //addScript('https://flyover.github.io/imgui-js/dist/imgui_impl.umd.js')
        ]);
        
       
      
    } catch (error) {
        console.error('Error loading scripts:', error);
    }
}


async function main() {
    try {
        await loadScripts(); // Wait for all scripts to be loaded
        
       await addScript('https://flyover.github.io/imgui-js/dist/imgui_impl.umd.js')
       await new Promise(resolve => setTimeout(resolve, 100));
        
      
      // Create a new canvas element
var canvas = document.createElement('canvas');

// Set the id and tabindex attributes
canvas.id = 'output';
canvas.tabIndex = '1';

// Apply the specified styles
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw'; // Set width to 100% of the viewport width
canvas.style.height = '100vh'; // Set height to 100% of the viewport height
canvas.style.zIndex = '99999';
canvas.style.backgroundColor = 'transparent'; // Make canvas transparent to not obstruct ImGui

// Append the canvas to the body of the document
document.body.appendChild(canvas);


      
      
      
var style = document.createElement('style');
  style.innerHTML = `
    #output {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);

(async function() {
  await ImGui.default();
  const canvas = document.getElementById("output");
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.scrollWidth * devicePixelRatio;
  canvas.height = canvas.scrollHeight * devicePixelRatio;
  window.addEventListener("resize", () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
  });

 
  
  ImGui.CreateContext();
  // ImGui_Impl.Init(canvas);

  ImGui.StyleColorsDark();
  //ImGui.StyleColorsClassic();
  


  const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);

 const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  
  const scene = new THREE.Scene();
	
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 10000);
	camera.position.set(0, 0, 500);
	scene.add(camera);
  
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
	light.position.set(0, 0, 350);
	light.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(light);

  

  ImGui_Impl.Init(canvas);
   
  
  function hexToRGBA(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return new ImGui.ImVec4(r / 255, g / 255, b / 255, 1.0);
}

const grayColor = hexToRGBA("#1a1720");
  
  const grayColor2 = hexToRGBA("#0f0d12");
  
  const grayColor3 = hexToRGBA("#b21907");


  
  ImGui.PushStyleVar(ImGui.StyleVar.ItemSpacing, new ImGui.ImVec2(10, 10)); // Increase item spacing
ImGui.PushStyleVar(ImGui.StyleVar.WindowPadding, new ImGui.ImVec2(20, 20)); // Increase window padding

  
  

ImGui.PushStyleColor(ImGui.Col.WindowBg, grayColor2); // Window background color
ImGui.PushStyleColor(ImGui.Col.FrameBg, grayColor); // Frame background color
ImGui.PushStyleColor(ImGui.Col.TitleBg, grayColor); // Title background color
ImGui.PushStyleColor(ImGui.Col.Border, grayColor); // Border color
ImGui.PushStyleColor(ImGui.Col.Button, grayColor); // Button color
ImGui.PushStyleColor(ImGui.Col.Header, grayColor); // Header color
ImGui.PushStyleColor(ImGui.Col.Separator, grayColor); // Separator color
ImGui.PushStyleColor(ImGui.Col.CheckMark, grayColor3); // Checkmark color
ImGui.PushStyleColor(ImGui.Col.SliderGrab, grayColor); // Slider grab color
ImGui.PushStyleColor(ImGui.Col.SliderGrabActive, grayColor); // Slider grab when active color
ImGui.PushStyleColor(ImGui.Col.ButtonHovered, grayColor); // Button hovered color
ImGui.PushStyleColor(ImGui.Col.ButtonActive, grayColor); // Button active color
ImGui.PushStyleColor(ImGui.Col.HeaderHovered, grayColor); // Header hovered color
ImGui.PushStyleColor(ImGui.Col.ResizeGrip, grayColor); // Resize grip color
ImGui.PushStyleColor(ImGui.Col.ResizeGripHovered, grayColor); // Resize grip hovered color
ImGui.PushStyleColor(ImGui.Col.ResizeGripActive, grayColor); // Resize grip when active color

  ImGui.PushStyleVar(ImGui.StyleVar.WindowRounding, 12);
  ImGui.PushStyleVar(ImGui.StyleVar.FrameRounding, 12); 

  let done = false;
  window.requestAnimationFrame(_loop);
  function _loop(time) {
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
  // ImGui.Begin("Debug");
ImGui.SetNextWindowSize(new ImGui.ImVec2(300, 300), ImGui.Cond.Once); // Set width and height to 100x100 pixels and make it unchangeable

    ImGui.Begin("Debug");
    
    
  
const textSize = 15; // Desired text size

ImGui.SetWindowFontScale(textSize / ImGui.GetFontSize()); // Adjust scale based on desired text size
  

ImGui.Text("AntiDetect Internal");
     ImGui.Separator();
ImGui.SetWindowFontScale(1); // Reset font scale to default
    
  let showCheckbox = false; // Variable to track checkbox state

if (ImGui.BeginCombo("Options", "Select an option")) {
    if (ImGui.Selectable("Button 1")) {
        // Handle button 1 click action
    }
    if (ImGui.Selectable("Button 2")) {
        // Handle button 2 click action
    }
    if (ImGui.Selectable("Button 3")) {
        // Handle button 3 click action
    }

    ImGui.Checkbox("Show Checkbox", (value) => {
        showCheckbox = value; // Update the checkbox state
    });

    ImGui.EndCombo();
}

// Use the showCheckbox variable to control the visibility of the checkbox
if (showCheckbox) {
    // Render the checkbox UI
}



    ImGui.End();

    ImGui.EndFrame();

    ImGui.Render();
    
    
    renderer.setClearColor(0x000000, 0);

    renderer.setSize(canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    // TODO: restore WebGL state in ImGui Impl
    renderer.state.reset();

    window.requestAnimationFrame(done ? _done : _loop);
  }

  function _done() {
    ImGui_Impl.Shutdown();
    ImGui.DestroyContext();
  }
  
  document.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
      ImGui.SetWindowFocus(null); // Unfocus ImGui if click is outside canvas
    }
  });
  
  
})();

      
      
      
      

    } catch (error) {
        console.error('Error loading scripts:', error);
    }
}

main();



