export const buttonStyles = {
  smallLabel : {fontSize: '12px', fontWeight: 700},
  smallSize: {height: 32, borderRadius: 3, lineHeight: '32px'},
  bigSize: {height: 44, width: 150,
    boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
    borderRadius: 4},
  bigLabel : {
    letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'
  }
}

export const headerStyles = {
  desktop: {
    fontSize: '30px',
    fontWeight: 200,
    textAlign: 'left',
    marginBottom: 30,
    marginTop: 30
  }
}

export const textFieldStyles = {
  input: {
    borderRadius: '2px', border: '1px solid #aaa',
      paddingLeft: '12px',  boxSizing: 'border-box'
  },
  hint: {
    paddingLeft: '12px', bottom: '8px'
  },
  style: {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',
  }
}

export const iconButtonStyles = {
  button: {
    padding: 0
  }
}

export const radioButtonStyles = {
  radioButton: {
    marginBottom: 16,
  },
}

export const chipStyles = {
    chip: {
      margin: 2,
      height: 25,
      lineHeight: '25px',
      width: 'fit-content',
    },
    chipLabel: {
      lineHeight: '25px'
    },
    deleteStyle: {
      margin: '0 0 0 -8px',
      height: 25
    }
}
