json.partial! "users/user", user: @user

if @token.present?
  json.authorization do
    json.token @token
  end
end