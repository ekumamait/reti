// For delete opportunity
handleDelete() {
  // ... existing delete logic ...
  .then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
}

// For create opportunity
handleSubmit() {
  // ... existing submit logic ...
  .then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
} 