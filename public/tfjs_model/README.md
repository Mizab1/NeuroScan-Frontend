# TensorFlow.js Model Directory for NeuroScan

Place your exported TensorFlow.js model files directly in this folder:

```
public/tfjs_model/
├── model.json
├── group1-shard1of1.bin
└── ... (any additional weight shards)
```

## Expected Model Architecture:

- **Input shape:** `(1, 256, 256, 3)` (RGB image resized to 256x256, normalized to [0, 1])
- **Output classes:** 4 units (Softmax) in order:
  1. `Glioma`
  2. `Meningioma`
  3. `No Tumor`
  4. `Pituitary`

Once placed here, NeuroScan will automatically detect the model, download and cache it in the browser's IndexedDB (`indexeddb://neuroscan-model`), perform WebGL shader warmup, and execute live client-side inferences.
