class CentresController < ApplicationController

  def index
    @centres = Center.all
    render :index, status: :ok
  end
end
