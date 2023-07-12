
exports.login = (req, res) => {
  res.status(200).render('login', {
    title: "Log into your Account"
  })
}

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: "Sign Up"
  })
}

exports.chatApp = (req, res) => {
  res.status(200).render('chatappV2', {
    title: "Sign Up "
  })
}