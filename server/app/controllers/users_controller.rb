class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :stripe, :change_password, :destroy]
  before_action :authenticate_user!, except: [:create, :authenticate, :forgot_password, :reset_password, :confirm_account]
  before_action :set_user_with_token, only: [:reset_password, :confirm_account]

  def show
    authorize(@user)
    render :show, status: :ok
  end

  def destroy
    authorize(@user)
    @user.forget
    render json: {}, status: :no_content
  end

  def update
    authorize(@user)
    @user.update!(user_params.except(:username))
    render :show, status: :ok
  end

  def change_password
    authorize(@user)
    @user.update!(user_params.except(:username))
    render :show, status: :ok
  end

  def stripe
    authorize(@user)
    @user.create_customer(customer_params)
    render :show, status: :ok
  end

  def create
    @user = User.create_with_mail(user_params)
    render :show, status: :created
  end

  def authenticate
    @user = User.from_provider(params)
    @token = @user.auth_token
    render :show, status: :ok
  end

  def confirm_account
    @user = current_user
    @user.confirm_account
    @token = @user.auth_token
    render :show, status: :ok
  end

  def forgot_password
    @user = User.find_by!(email_address: params[:email_address])
    @user.password_token
    render json: {}, status: :ok
  end

  def reset_password
    @user = current_user
    @user.update!(password: params[:password])
    render json: {}, status: :ok
  end

  private

  def user_params
    params.permit(:first_name, :last_name, :username, :email_address, :password, :password_confirmation, :photo_id, :date_of_birth, :telephone, :disclaimer, :address)
  end

  def customer_params
    params.permit(:stripe_token)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
